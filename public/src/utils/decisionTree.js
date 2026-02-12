// This is a placeholder for a more complex decision tree logic.
// Future expansion could allow interactive "Yes/No" troubleshooting flows.

export const getBasicTroubleshootingSteps = (componentName) => {
    const steps = {
        "RAM Module": [
            "Check if the RAM stick is properly seated in the slot.",
            "Try cleaning the contacts with a soft eraser.",
            "Test one stick at a time if you have multiple."
        ],
        "Hard Disk Drive (HDD)": [
            "Listen for clicking sounds (sign of mechanical failure).",
            "Check SATA and power cables.",
            "Run a disk utility check (like CHKDSK)."
        ],
        // ... add more generics as fallback
    };

    return steps[componentName] || ["Check connections.", "Restart the device.", "Consult the manual."];
};
