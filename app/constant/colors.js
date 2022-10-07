const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';
const black = '#000';

const Colors = {
  light: {
    modalLine: '#9DA0AF',
    background: '#fff',
    backgroundWarning: '#FFF9EB',
    backgroundEnergy: 'rgba(240, 210, 66, 0.2)',
    backgroundSelectable: '#FAFFFD',
    backgroundPrimary: '#ECECEF',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    iconHeart: '#E64D4D',
    tabIconSelected: tintColorLight,

    buttonBackground2: '#dbfefa',
    main: '#ecfefe',
    incorrect: '#E23636',
    borderColor: '#ECECEF',
    mintStageActive: '#01B47C',
    mintStageDefault: '#CCCCCC',
    controlSecondary: '#FCFCFD',
    borderPrimary: '#ECECEF',
    borderDanger: '#E64D4D',

    text: {
      primary: '#393C46',
      secondary: '#73788C',
      accent: '#40BF95',
      critical: '#E54D4D',
      warning: '#C28C00',
      danger: '#E64D4D',
      onDark: '#FFFFFF',
      completed: '#439834',
    },
    icon: {
      primary: '#40434F',
      secondary: '#818598',
    },
    surface: {
      tertiary: '#FCFCFD',
      highlighted: '#40BF95',
    },
    border: {
      primary: '#ECECEF',
      accent: '#40BF95',
      critical: '#E54D4D',
    },
    shadow: {
      selected: '#C3EFE0',
      default: '#DEDFE3',
    },

    //buttons
    buttonText: '#393C46',
    buttonTextDisabled: '#8F93A3',

    buttonBackground: '#BDFFE9',
    buttonShadow: '#86DFC2',
    buttonBorder: '#BDFFE9',
    buttonBackgroundPress: '#99FFDD',
    buttonBackgroundDisabled: '#EBFFF8',
    buttonShadowDisabled: '#C3EFE0',

    buttonBackgroundOutline: '#FFFFFF',
    buttonBorderOutline: '#ECECEF',
    buttonShadowOutline: '#DDDFE3',
    buttonBackgroundPressOutline: '#F4F4F6',
    buttonBackgroundOutlineDisabled: '#FFFFFF',
    buttonShadowDisabledOutline: '#E9E9ED',

    buttonBackgroundCritical: '#FFBDBD',
    buttonBorderCritical: '#FFBDBD',
    buttonShadowCritical: '#E69999',
    buttonBackgroundPressCritical: '#FFADAD',
    buttonBackgroundCriticalDisabled: '#FFEBEB',
    buttonShadowDisabledCritical: '#F5D6D6',

    buttonTextTexted: '#40BF95',
    buttonTextTextedPress: '#39AC86',
    buttonTextTextedDisabled: '#8F93A3',

    bulletActive: '#47C299',
    bullet: '#EEEFF1',

    inputBackground: '#FCFCFD',
    inputPlaceHolder: '#9A9A9A',
    inputActiveBorder: '#40BF95',

    stageIndicatorDefault: '#E9E9ED',
    stageIndicatorActive: '#8CC982',
    petCardIdBorderColor: '#000',
    levelIndicatorBackGround: '#E9E9ED',
    levelIndicatorFillColor: '#40BF95',
    healthIndicatorFillColor: '#8CC982',

    switchOn: '#65C454',

    petRankItem: {
      backgroundDefault: '#fff',
      borderColorDefault: '#E3E4E8',
      shadowColorDefault: '#DEDFE3',
      backgroundSelected: '#FAFFFD',
      borderColorSelected: '#40BF95',
      shadowColorSelected: '#C3EFE0',
      divider: '#E3E4E8',
    },
    modal: {
      modalOverlay: '#1F222E',
      background: '#fff',
      shadowColor: '#DEDFE3',
      qrScannerOverlay: '#181B25',
    },
    navigationBar: {
      background: '#EBFFF8',
      elementsBackground: '#fff',
      elementsBorder: '#ECECEF',
      shadowColor: '#DDDFE3',
    },
    divider: '#ECECEF',
    circle: '#E3E4E8',
    purchasingFrom: {
      backgroundDefault: '#fff',
      borderColorDefault: '#E3E4E8',
      shadowColorDefault: '#DEDFE3',
      backgroundSelected: '#FAFFFD',
      borderColorSelected: '#40BF95',
      shadowColorSelected: '#C3EFE0',
    },
    mintPriceBackground: {
      mintPriceContainer: 'rgba(238, 176, 0, 0.2)',
      mintPrice: '#B78504',
    },
    statutes: {
      confirmed: {
        background: '#F1FAF0',
        text: '#439834',
      },
      failed: {
        background: '#FFF5F5',
        text: '#E54D4D',
      },
      pending: {
        background: '#FFF9EB',
        text: '#C28C00',
      },
    },
    radio: {
      backgroundDefault: '#FCFCFD',
      borderDefault: '#E3E4E8',
      borderActive: '#40BF95',
      backgroundActive: '#40BF95',
    },
    energyProgress: {
      full: '#8CC982',
      high: '#E7C66F',
      low: '#E87373',
      background: '#E9E9ED',
    },
    levelProgress: {
      text: {
        level: '#C28C00',
        full: '#8CC982',
      },
      full: '#40BF95',
      background: '#E9E9ED',
      low: '#73788C',
    },
    avatarBackground: {
      purple: 'rgba(176, 168, 240, 0.2)',
      blue: 'rgba(146, 198, 236, 0.2)',
      green: 'rgba(188, 209, 148, 0.2)',
      orange: 'rgba(233, 179, 98, 0.2)',
      yellow: 'rgba(240, 210, 66, 0.2)',
    },
    taskHistoryBg: {
      moveTask: 'rgba(176, 168, 240, 0.2)',
      playTask: 'rgba(240, 210, 66, 0.2)',
      socialTask: 'rgba(233, 179, 98, 0.2)',
      verificationTask: 'rgba(146, 198, 236, 0.2)',
    },
  },
  dark: {
    modalLine: '#9DA0AF',
    background: '#fff',
    backgroundWarning: '#FFF9EB',
    backgroundEnergy: 'rgba(240, 210, 66, 0.2)',
    backgroundSelectable: '#FAFFFD',
    backgroundPrimary: '#ECECEF',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    iconHeart: '#E64D4D',

    buttonBackground2: '#dbfefa',
    main: '#ecfefe',
    incorrect: '#E23636',
    borderColor: '#ECECEF',
    mintStageActive: '#01B47C',
    mintStageDefault: '#CCCCCC',
    controlSecondary: '#FCFCFD',
    borderPrimary: '#ECECEF',
    borderDanger: '#E64D4D',

    text: {
      primary: '#393C46',
      secondary: '#73788C',
      accent: '#40BF95',
      critical: '#E54D4D',
      warning: '#C28C00',
      danger: '#E64D4D',
      onDark: '#FFFFFF',
      completed: '#439834',
    },
    icon: {
      primary: '#40434F',
      secondary: '#818598',
    },
    surface: {
      tertiary: '#FCFCFD',
      highlighted: '#40BF95',
    },
    border: {
      primary: '#ECECEF',
      accent: '#40BF95',
      critical: '#E54D4D',
    },
    shadow: {
      selected: '#C3EFE0',
      default: '#DEDFE3',
    },

    //buttons
    buttonText: '#393C46',
    buttonTextDisabled: '#8F93A3',

    buttonBackground: '#BDFFE9',
    buttonShadow: '#86DFC2',
    buttonBorder: '#BDFFE9',
    buttonBackgroundPress: '#99FFDD',
    buttonBackgroundDisabled: '#EBFFF8',
    buttonShadowDisabled: '#C3EFE0',

    buttonBackgroundOutline: '#FFFFFF',
    buttonBorderOutline: '#ECECEF',
    buttonShadowOutline: '#DDDFE3',
    buttonBackgroundPressOutline: '#F4F4F6',
    buttonBackgroundOutlineDisabled: '#FFFFFF',
    buttonShadowDisabledOutline: '#E9E9ED',

    buttonBackgroundCritical: '#FFBDBD',
    buttonBorderCritical: '#FFBDBD',
    buttonShadowCritical: '#E69999',
    buttonBackgroundPressCritical: '#FFADAD',
    buttonBackgroundCriticalDisabled: '#FFEBEB',
    buttonShadowDisabledCritical: '#F5D6D6',

    buttonTextTexted: '#40BF95',
    buttonTextTextedPress: '#39AC86',
    buttonTextTextedDisabled: '#8F93A3',

    bulletActive: '#47C299',
    bullet: '#EEEFF1',

    inputBackground: '#FCFCFD',
    inputPlaceHolder: '#9A9A9A',
    inputActiveBorder: '#40BF95',

    stageIndicatorDefault: '#E9E9ED',
    stageIndicatorActive: '#8CC982',
    petCardIdBorderColor: '#000',
    levelIndicatorBackGround: '#E9E9ED',
    levelIndicatorFillColor: '#40BF95',
    healthIndicatorFillColor: '#8CC982',

    switchOn: '#65C454',

    petRankItem: {
      backgroundDefault: '#fff',
      borderColorDefault: '#E3E4E8',
      shadowColorDefault: '#DEDFE3',
      backgroundSelected: '#FAFFFD',
      borderColorSelected: '#40BF95',
      shadowColorSelected: '#C3EFE0',
      divider: '#E3E4E8',
    },
    modal: {
      modalOverlay: '#1F222E',
      background: '#fff',
      shadowColor: '#DEDFE3',
      qrScannerOverlay: '#181B25',
    },
    navigationBar: {
      background: '#EBFFF8',
      elementsBackground: '#fff',
      elementsBorder: '#ECECEF',
      shadowColor: '#DDDFE3',
    },
    divider: '#ECECEF',
    circle: '#E3E4E8',
    purchasingFrom: {
      backgroundDefault: '#fff',
      borderColorDefault: '#E3E4E8',
      shadowColorDefault: '#DEDFE3',
      backgroundSelected: '#FAFFFD',
      borderColorSelected: '#40BF95',
      shadowColorSelected: '#C3EFE0',
    },
    mintPriceBackground: {
      mintPriceContainer: 'rgba(238, 176, 0, 0.2)',
      mintPrice: '#B78504',
    },
    statutes: {
      confirmed: {
        background: '#F1FAF0',
        text: '#439834',
      },
      failed: {
        background: '#FFF5F5',
        text: '#E54D4D',
      },
      pending: {
        background: '#FFF9EB',
        text: '#C28C00',
      },
    },
    radio: {
      backgroundDefault: '#FCFCFD',
      borderDefault: '#E3E4E8',
      borderActive: '#40BF95',
      backgroundActive: '#40BF95',
    },
    energyProgress: {
      full: '#8CC982',
      high: '#E7C66F',
      low: '#E87373',
      background: '#E9E9ED',
    },
    levelProgress: {
      text: {
        level: '#C28C00',
        full: '#8CC982',
      },
      full: '#40BF95',
      background: '#E9E9ED',
      low: '#73788C',
    },
    avatarBackground: {
      purple: 'rgba(176, 168, 240, 0.2)',
      blue: 'rgba(146, 198, 236, 0.2)',
      green: 'rgba(188, 209, 148, 0.2)',
      orange: 'rgba(233, 179, 98, 0.2)',
      yellow: 'rgba(240, 210, 66, 0.2)',
    },
    taskHistoryBg: {
      moveTask: 'rgba(176, 168, 240, 0.2)',
      playTask: 'rgba(240, 210, 66, 0.2)',
      socialTask: 'rgba(233, 179, 98, 0.2)',
      verificationTask: 'rgba(146, 198, 236, 0.2)',
    },
  },
};

export default Colors;
