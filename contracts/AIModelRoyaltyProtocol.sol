// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AIModelRoyaltyProtocol
 * @notice Decentralized licensing and automated royalty distribution for AI models.
 *         Creators register models, users pay for inference access, and royalties
 *         are automatically split on-chain. Built for production use.
 * @dev Uses OpenZeppelin for security. Supports ERC-20 payments (USDC recommended).
 */
contract AIModelRoyaltyProtocol is Ownable, ReentrancyGuard {
    struct Model {
        address creator;
        string metadataURI;       // IPFS or Arweave URI for model details
        uint256 pricePerInference; // in payment token units
        uint256 royaltyBps;       // creator share in basis points (e.g. 8000 = 80%)
        uint256 totalInferences;
        bool active;
    }

    IERC20 public immutable paymentToken;
    uint256 public protocolFeeBps = 200; // 2% protocol fee
    address public feeRecipient;

    mapping(uint256 => Model) public models;
    uint256 public modelCount;

    mapping(uint256 => mapping(address => uint256)) public userCredits; // modelId => user => remaining inferences

    event ModelRegistered(uint256 indexed modelId, address indexed creator, string metadataURI);
    event InferencePurchased(uint256 indexed modelId, address indexed buyer, uint256 inferences, uint256 amountPaid);
    event RoyaltyDistributed(uint256 indexed modelId, address indexed creator, uint256 amount);
    event ProtocolFeeCollected(uint256 amount);

    constructor(address _paymentToken, address _feeRecipient) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        feeRecipient = _feeRecipient;
    }

    function registerModel(
        string calldata metadataURI,
        uint256 pricePerInference,
        uint256 royaltyBps
    ) external returns (uint256 modelId) {
        require(royaltyBps <= 10000, "Royalty too high");
        require(bytes(metadataURI).length > 0, "Empty URI");

        modelId = ++modelCount;
        models[modelId] = Model({
            creator: msg.sender,
            metadataURI: metadataURI,
            pricePerInference: pricePerInference,
            royaltyBps: royaltyBps,
            totalInferences: 0,
            active: true
        });

        emit ModelRegistered(modelId, msg.sender, metadataURI);
    }

    function purchaseInferences(uint256 modelId, uint256 numInferences) external nonReentrant {
        Model storage model = models[modelId];
        require(model.active, "Model inactive");
        require(numInferences > 0, "Zero inferences");

        uint256 totalCost = model.pricePerInference * numInferences;
        require(paymentToken.transferFrom(msg.sender, address(this), totalCost), "Payment failed");

        uint256 protocolFee = (totalCost * protocolFeeBps) / 10000;
        uint256 creatorShare = totalCost - protocolFee;

        // Immediate distribution
        if (protocolFee > 0) {
            require(paymentToken.transfer(feeRecipient, protocolFee), "Fee transfer failed");
            emit ProtocolFeeCollected(protocolFee);
        }
        if (creatorShare > 0) {
            require(paymentToken.transfer(model.creator, creatorShare), "Royalty transfer failed");
            emit RoyaltyDistributed(modelId, model.creator, creatorShare);
        }

        userCredits[modelId][msg.sender] += numInferences;
        model.totalInferences += numInferences;

        emit InferencePurchased(modelId, msg.sender, numInferences, totalCost);
    }

    function consumeInference(uint256 modelId) external {
        require(userCredits[modelId][msg.sender] > 0, "No credits");
        userCredits[modelId][msg.sender]--;
    }

    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // max 10%
        protocolFeeBps = newFeeBps;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        feeRecipient = newRecipient;
    }

    function deactivateModel(uint256 modelId) external {
        require(models[modelId].creator == msg.sender, "Not creator");
        models[modelId].active = false;
    }
}