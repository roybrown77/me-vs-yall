const a11yProps = (index, idPrefix = "simple") => {
    return {
        id: `${idPrefix}-tab-${index}`,
        "aria-controls": `${idPrefix}-tabpanel-${index}`,
    };
};

export default a11yProps;
