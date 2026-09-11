const getFlag = (country) => {
  switch (country) {
    case "USA":
      return "🇺🇸";
    case "MEXICO":
      return "🇲🇽";
    case "BRAZIL":
      return "🇧🇷";
    case "ITALY":
      return "🇲🇽";
    case "ICELAND":
      return "🇮🇸";
    case "SWEDEN":
      return "🇸🇪";
    case "RUSSIA":
      return "🇷🇺";
    case "PHILLIPINES":
      return "🇵🇭";
    case "BULGARIA":
      return "🇧🇬";
    case "ENGLAND":
      return "🇬🇧";
    case "CROATIA":
      return "🇭🇷";
    case "SURINAME":
      return "🇸🇷";
    case "NETHERLANDS":
      return "🇳🇱";
    case "JAPAN":
      return "🇯🇵";
    case "BAHAMAS":
      return "🇧🇸";
    case "UKRAINE":
      return "🇺🇦";
    case "NIGERIA":
      return "🇳🇬";
    case "POLAND":
      return "🇵🇱";
    case "DOMINICAN REPUBLIC":
      return "🇩🇴";
    case "AUSTRALIA":
      return "🇦🇺";
    case "SOUTH KOREA":
      return "🇰🇷";
    case "NICARAGUA":
      return "🇳🇮";
    case "JAMAICA":
      return "🇯🇲";
    case "SOUTH AFRICA":
      return "🇿🇦";
    case "UK":
      return "🇬🇧";
    default:
      return "🇺🇸";
  }
};

export default getFlag;
