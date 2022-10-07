const ROUTES = {
  /**
   * BottomTab
   */
  BOTTOM_TAB_ROOT: 'BottomTabRoot',
  PLAY: 'Play',
  CHARITY: 'Charity',
  STATISTICS: 'Statistics',
  COLLECTION: 'Collection',
  MARKETPLACE: 'Marketplace',
  /**
   * Admin
   */
  ADMIN_ROOT: 'AdminRoot',
  ADMIN_VERIFY: 'AdminVerify',
  /**
   * Mint
   */
  MINT_ROOT: 'MintRoot',
  MINT_PET_RANKS: 'MintPetRanks',
  MINT_PET_SELECT_GENERATION: 'MintPetSelectGeneration',
  MINT_GENERATION_INFO: 'MintGenerationInfo',
  MINT_SELECT_GENERATED_NFT: 'MintSelectGeneratedNft',
  MINT_PET_PICK_PHOTO: 'MintPetPickPhoto',
  MINT_PET_EDIT_PHOTO: 'MintPetEditPhoto',
  MINT_PET_NAME: 'MintPetName',
  MINT_PET_CHECKOUT: 'MintPetCheckout',
  MINT_PET_CHECKOUT_SUCCESS: 'MintPetCheckoutSuccess',
  /**
   * CreateWallet
   */
  ADD_WALLET_INITIAL: 'AddWalletInitial',
  IMPORT_WALLET: 'ImportWallet',
  CREATE_WALLET_FIRST: 'CreateWalletFirst',
  CREATE_WALLET_PASSPHRASE: 'CreateWalletPassphrase',
  CREATE_WALLET_VERIFICATION: 'CreateWalletVerification',
  CREATE_WALLET_SUCCESS: 'CreateWalletSuccess',
  /**
   * LOGIN
   */
  LOGIN: 'Login',
  /**
   * Wallet
   */
  WALLET_ROOT: 'WalletRoot',
  // Tabs
  WALLET_COINS_MAIN: 'WalletCoinsMain',
  WALLET_NFTS_MAIN: 'WalletNFTSMain',
  WALLET_REWARDS_MAIN: 'WalletRewardsMain',
  // Coins
  WALLET_COINS_BALANCE: 'WalletCoinsBalance',
  WALLET_COINS_WITHDRAW: 'WalletCoinsWithdraw',
  WALLET_COINS_WITHDRAW_SUCCESS: 'WalletCoinsWithdrawSuccess',
  WALLET_COINS_TRANSACTION_DETAILS: 'WalletCoinsTransactionDetails',
  // NFT
  WALLET_NFTS_LIST: 'WalletNFTSList',
  WALLET_NFTS_WITHDRAW: 'WalletNFTSWithdraw',
  WALLET_NFTS_WITHDRAW_SUCCESS: 'WalletNFTSWithdrawSuccess',
  WALLET_NFTS_TRANSACTION_DETAILS: 'WalletNFTSTransactionDetails',
  // Rewards
  WALLET_REWARDS_CLAIM_SUCCESS: 'WalletRewardsClaimSuccess',
  WALLET_REWARDS_TRANSACTION_DETAILS: 'WalletRewardsTransactionDetails',
  // Trade
  WALLET_TRADE_MAIN: 'WalletTradeMain',
  WALLET_TRADE_SUCCESS: 'WalletTradeSuccess',
  // Settings
  WALLET_SETTINGS: 'WalletSettings',
  WALLET_SETTINGS_BACKUP: 'WalletSettingsBackup',
  /**
   * Play
   */
  PLAY_TASKS: 'PlayTasks',
  PLAY_TASKS_ACTIVE: 'PlayTasksActive',
  PLAY_TASKS_HISTORY: 'PlayTasksHistory',
  PLAY_EDIT_NFTS: 'PlayEditNFTs',
  PLAY_TASKS_HISTORY_DETAILS: 'PlayTasksHistoryDetails',
  PLAY_COLLECTED_EXPERIENCE: 'PlayCollectedExperience',
  PLAY_TASK_SUCCESS: 'PlaySuccessScreen',
  /**
   * Socialize To Earn
   */
  SOCIALIZE_TO_EARN_WELCOME_SHARE: 'SocializeToEarnWelcomeShare',
  SOCIALIZE_TO_EARN_SHARE_YOUR_PHOTO: 'SocializeToEarnShareYourPhoto',
  SOCIALIZE_TO_EARN_CREATE_SHARE_PHOTO: 'SocializeToEarnCreateSharePhoto',
  SOCIALIZE_TO_EARN_VERIFY_USER: 'SocializeToEarnVerifyUser',

  SOCIALIZE_TO_EARN_VERIFY_USER_ERROR: 'SocializeToEarnVerifyUserError',
  SOCIALIZE_TO_EARN_SHARE_YOUR_PHOTO_SUCCESS:
    'SocializeToEarnShareYourPhotoSuccess',
  SOCIALIZE_TO_EARN_WELCOME_VERIFY: 'SocializeToEarnWelcomeVerify',
  SOCIALIZE_TO_EARN_VERIFY_USER_MATCH: 'SocializeToEarnVerifyUserMatch',
  SOCIALIZE_TO_EARN_VERIFY_USER_NOT_FOUND: 'SocializeToEarnVerifyUserNotFound',
  SOCIALIZE_TO_EARN_VERIFY_USER_FAILED: 'SocializeToEarnVerifyUserFailed',
  SOCIALIZE_TO_EARN_VERIFY_USER_ALREADY_COMPLETED:
    'SocializeToEarnVerifyUserAlreadyCompleted',
  /**
   * Move To Earn
   */
  MOVE_TO_EARN_WELCOME: 'MoveToEarnWelcome',
  MOVE_TO_EARN_PROGRESS: 'MoveToEarnProgress',
  MOVE_TO_EARN_SUMMARY: 'MoveToEarnSummary',
  /**
   * Play to Earn
   */
  PLAY_TO_EARN_WELCOME: 'PlayToEarnWelcome',
  PLAY_TO_EARN_PROGRESS: 'PlayToEarnProgress',
  /**
   * Charity
   */
  CHARITY_ORGANIZATIONS: 'CharityOrganizations',
  CHARITY_DETAILED_ORGANIZATION: 'CharityDetailedOrganization',
  CHARITY_ORGANIZATION_DONATIONS: 'CharityOrganizationDonations',
  CHARITY_EDIT_SELECTED_ORGANIZATION: 'CharityEditSelectedOrganization',
  CHARITY_EDIT_DETAILED_ORGANIZATION: 'CharityEditDetailedOrganization',
  /**
   * Collection
   */
  COLLECTION_DETAILED_PET: 'CollectionDetailedPet',
  COLLECTION_PET_LEVEL_UP_CHECKOUT: 'CollectionPetLevelUpCheckout',
  COLLECTION_PET_LEVEL_UP_SUCCESS: 'CollectionPetLevelUpSuccess',
  COLLECTION_PET_RANK_UP_CHECKOUT: 'CollectionPetRankUpCheckout',
  COLLECTION_PET_RANK_UP_SUCCESS: 'CollectionPetRankUpSuccess',
  /**
   * Profile
   */
  PROFILE_ROOT: 'ProfileRoot',
  PROFILE_MAIN: 'ProfileMain',
  PROFILE_LANGUAGES_SETTINGS: 'ProfileLanguagesSettings',
  PROFILE_NOTIFICATIONS_SETTINGS: 'ProfileNotificationsSettings',
  PROFILE_SOCIAL_ACCOUNTS_SETTINGS: 'ProfileSocialAccountsSettings',
  /**
   * Others
   */
  DEV: 'Dev',
  ENTER_REFERRAL_CODE: 'EnterReferralCode',
};
export default ROUTES;
