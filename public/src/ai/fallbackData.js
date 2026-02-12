// Fallback data for all hardware components
// Used when AI generation fails or is unavailable

export const COMPONENT_FALLBACK_DATA = {
    "ram_module": {
        title: "RAM Module",
        description: "Random Access Memory module for temporary data storage",
        tips: [
            "Check compatibility with motherboard before purchasing",
            "Match speed (MHz) and type (DDR3/DDR4/DDR5) with existing RAM",
            "Ground yourself before handling to prevent static damage",
            "Insert firmly until clips click into place"
        ],
        troubleshooting: [
            "If PC won't boot: Reseat RAM modules",
            "If blue screen errors: Test with Windows Memory Diagnostic",
            "If slow performance: Check if RAM is running at correct speed"
        ]
    },
    "ram_stick": {
        title: "RAM Stick",
        description: "Individual Random Access Memory stick",
        tips: [
            "Handle by edges only",
            "Check for gold contacts - clean if tarnished",
            "Install in matching pairs for dual-channel performance",
            "Consult motherboard manual for optimal slot placement"
        ],
        troubleshooting: [
            "System not recognizing RAM: Try different slots",
            "Frequent crashes: Run MemTest86",
            "Capacity not showing: Check BIOS settings"
        ]
    },
    "hard_drive": {
        title: "Hard Drive",
        description: "Traditional magnetic storage device",
        tips: [
            "Backup important data regularly",
            "Defragment monthly for optimal performance",
            "Keep away from magnets",
            "Handle gently - moving parts are sensitive"
        ],
        troubleshooting: [
            "Clicking sounds: Immediate backup needed - drive failing",
            "Slow performance: Check for bad sectors",
            "Not detected: Check SATA/power cables"
        ]
    },
    "ssd": {
        title: "Solid State Drive",
        description: "Fast flash-based storage with no moving parts",
        tips: [
            "Enable TRIM for longevity",
            "Leave 15-20% free space for optimal performance",
            "Avoid frequent full writes to extend lifespan",
            "Update firmware for better performance"
        ],
        troubleshooting: [
            "Slow performance: Check if TRIM is enabled",
            "Not detected: Update storage controller drivers",
            "Random disconnects: Check SATA cable connection"
        ]
    },
    "capacitor": {
        title: "Capacitor",
        description: "Electronic component that stores and releases electrical energy",
        tips: [
            "Check for bulging or leaking capacitors on motherboard",
            "Replace with same voltage and capacitance rating",
            "Observe polarity when installing",
            "Discharge power before replacing"
        ],
        troubleshooting: [
            "Bulging caps: Replace immediately",
            "System won't boot: Check all capacitors visually",
            "Random reboots: Capacitors may be failing"
        ]
    },
    "motherboard": {
        title: "Motherboard",
        description: "Main circuit board connecting all computer components",
        tips: [
            "Keep BIOS/UEFI updated",
            "Clean dust from heatsinks and fans regularly",
            "Check for bent pins in CPU socket",
            "Use anti-static wrist strap when handling"
        ],
        troubleshooting: [
            "No power: Check PSU connections",
            "No display: Reseat RAM and GPU",
            "USB ports not working: Check BIOS settings"
        ]
    },
    "charging_port": {
        title: "Charging Port",
        description: "Port for charging devices and data transfer",
        tips: [
            "Clean port gently with compressed air",
            "Avoid forcing cables in wrong orientation",
            "Use quality cables to prevent damage",
            "Check for debris before connecting"
        ],
        troubleshooting: [
            "Not charging: Clean port with toothpick carefully",
            "Loose connection: Port may need replacement",
            "Intermittent charging: Check cable first"
        ]
    },
    "processor": {
        title: "Processor (CPU)",
        description: "Central processing unit - brain of the computer",
        tips: [
            "Apply thermal paste correctly - pea-sized amount",
            "Ensure cooler is properly seated",
            "Monitor temperatures with software",
            "Don't overtighten cooler screws"
        ],
        troubleshooting: [
            "Overheating: Reapply thermal paste",
            "System unstable: Check for overheating",
            "Poor performance: Check if thermal throttling"
        ]
    },
    "sim_slot": {
        title: "SIM Card Slot",
        description: "Slot for SIM cards in mobile devices",
        tips: [
            "Use SIM eject tool, not paperclip",
            "Insert SIM in correct orientation",
            "Keep slot clean and dry",
            "Remove SIM before cleaning device"
        ],
        troubleshooting: [
            "No signal: Ensure SIM is inserted correctly",
            "SIM not detected: Clean contacts gently",
            "Slot damaged: May need professional repair"
        ]
    },
    "battery": {
        title: "Battery",
        description: "Portable power source for devices",
        tips: [
            "Charge between 20-80% for longevity",
            "Avoid extreme temperatures",
            "Store at 50% charge for long periods",
            "Use original charger when possible"
        ],
        troubleshooting: [
            "Not holding charge: Battery may need replacement",
            "Swelling: Replace immediately - safety hazard",
            "Not charging: Check charging port and cable"
        ]
    },
    "display_connector": {
        title: "Display Connector",
        description: "Interface for connecting displays (HDMI, DisplayPort, VGA)",
        tips: [
            "Push firmly until it clicks",
            "Secure screws for stable connection",
            "Use correct cable type for resolution",
            "Check for bent pins in connectors"
        ],
        troubleshooting: [
            "No signal: Try different cable",
            "Flickering: Check cable connection",
            "Wrong resolution: Update graphics drivers"
        ]
    },
    "usb_port": {
        title: "USB Port",
        description: "Universal Serial Bus port for connecting peripherals",
        tips: [
            "Insert firmly but gently",
            "Check USB version for speed requirements",
            "Clean port with compressed air",
            "Use USB hubs for more connections"
        ],
        troubleshooting: [
            "Not working: Try different device",
            "Loose connection: Port may be worn out",
            "Error message: Update USB drivers"
        ]
    },
    "hdmi_port": {
        title: "HDMI Port",
        description: "High-Definition Multimedia Interface for audio/video",
        tips: [
            "Supports audio and video in one cable",
            "Check HDMI version for features",
            "Secure connection for 4K+ resolutions",
            "Use quality cables for long distances"
        ],
        troubleshooting: [
            "No signal: Try different HDMI port",
            "Poor quality: Check cable quality",
            "Audio issues: Check audio output settings"
        ]
    },
    "ethernet_port": {
        title: "Ethernet Port",
        description: "Network port for wired internet connection",
        tips: [
            "Click until you hear the latch",
            "Use cable management to prevent damage",
            "Check link lights for connection status",
            "Prefer over WiFi for stability"
        ],
        troubleshooting: [
            "No connection: Check cable and router",
            "Slow speed: Update network drivers",
            "Limited connectivity: Check IP settings"
        ]
    },
    "vga_port": {
        title: "VGA Port",
        description: "Video Graphics Array - older display connection",
        tips: [
            "Analog signal - quality degrades over distance",
            "Secure screws for stable connection",
            "Limited to lower resolutions",
            "Being phased out for digital connections"
        ],
        troubleshooting: [
            "No display: Tighten connector screws",
            "Ghosting: Check cable quality",
            "Wrong resolution: Adjust display settings"
        ]
    },
    "dvi_port": {
        title: "DVI Port",
        description: "Digital Visual Interface for displays",
        tips: [
            "Better quality than VGA",
            "Check DVI type (D, A, I)",
            "Secure connection for best quality",
            "May require adapter for modern displays"
        ],
        troubleshooting: [
            "No signal: Check DVI cable type",
            "Poor quality: Use digital DVI-D",
            "Not detected: Update graphics drivers"
        ]
    },
    "power_supply_unit": {
        title: "Power Supply Unit (PSU)",
        description: "Converts AC power to DC for computer components",
        tips: [
            "Choose wattage 20% above requirements",
            "Check efficiency rating (80+ Bronze/Gold)",
            "Keep cables organized for airflow",
            "Don't cheap out - critical component"
        ],
        troubleshooting: [
            "No power: Check PSU switch and outlet",
            "Random reboots: PSU may be failing",
            "Loud noises: Fan may be failing"
        ]
    },
    "graphics_card": {
        title: "Graphics Card (GPU)",
        description: "Processes video and graphics for display",
        tips: [
            "Ensure sufficient power supply wattage",
            "Install latest drivers for performance",
            "Monitor temperatures during gaming",
            "Clean dust from heatsink regularly"
        ],
        troubleshooting: [
            "No display: Reseat graphics card",
            "Artifacts: Overheating or failing card",
            "Poor performance: Update drivers"
        ]
    },
    "cooling_fan": {
        title: "Cooling Fan",
        description: "Moves air to cool computer components",
        tips: [
            "Clean dust monthly for efficiency",
            "Replace if making grinding noises",
            "Check fan direction for optimal airflow",
            "Use fan controller for speed management"
        ],
        troubleshooting: [
            "Loud noise: Clean or replace fan",
            "Not spinning: Check fan connection",
            "High temps: Add more fans or upgrade"
        ]
    },
    "heat_sink": {
        title: "Heat Sink",
        description: "Metal component that dissipates heat from chips",
        tips: [
            "Clean fins regularly for heat transfer",
            "Use thermal paste with CPU/GPU",
            "Ensure proper contact with component",
            "Consider liquid cooling for high performance"
        ],
        troubleshooting: [
            "Overheating: Clean and reapply thermal paste",
            "Poor contact: Check mounting pressure",
            "Not enough cooling: Upgrade to larger heatsink"
        ]
    },
    "sata_cable": {
        title: "SATA Cable",
        description: "Serial ATA cable for storage devices",
        tips: [
            "Click firmly into place",
            "Avoid sharp bends in cable",
            "Use shortest cable that fits",
            "Replace if showing signs of damage"
        ],
        troubleshooting: [
            "Drive not detected: Reseat SATA cable",
            "Slow transfer: Check cable quality",
            "Intermittent connection: Replace cable"
        ]
    },
    "power_cable": {
        title: "Power Cable",
        description: "Electrical cable for powering devices",
        tips: [
            "Ensure proper voltage rating",
            "Check for frayed insulation",
            "Use correct gauge for power draw",
            "Secure connections to prevent disconnection"
        ],
        troubleshooting: [
            "No power: Check cable and outlet",
            "Intermittent power: Replace cable",
            "Overheating: Check for loose connections"
        ]
    },
    "vga_cable": {
        title: "VGA Cable",
        description: "Analog video cable for older displays",
        tips: [
            "Tighten screws for stable connection",
            "Avoid sharp bends near connectors",
            "Maximum length ~50ft for quality",
            "Being replaced by digital connections"
        ],
        troubleshooting: [
            "Poor quality: Check cable length",
            "Ghosting: Try shorter cable",
            "No signal: Check connection and pins"
        ]
    },
    "dvi_cable": {
        title: "DVI Cable",
        description: "Digital video cable for displays",
        tips: [
            "Better quality than VGA",
            "Check connector type (DVI-D/I/A)",
            "Secure thumbscrews firmly",
            "Supports higher resolutions than VGA"
        ],
        troubleshooting: [
            "No signal: Check DVI type compatibility",
            "Sparkles: Loose connection or bad cable",
            "Limited resolution: Check cable quality"
        ]
    },
    "keyboard": {
        title: "Keyboard",
        description: "Input device for typing",
        tips: [
            "Clean regularly to prevent sticky keys",
            "Use compressed air for debris removal",
            "Consider mechanical for better typing",
            "Update firmware for gaming keyboards"
        ],
        troubleshooting: [
            "Keys not working: Try different USB port",
            "Sticky keys: Clean under keycaps",
            "Wireless issues: Replace batteries"
        ]
    },
    "mouse": {
        title: "Mouse",
        description: "Pointing device for cursor control",
        tips: [
            "Clean sensor regularly",
            "Use mousepad for optical mice",
            "Update drivers for gaming mice",
            "Check DPI settings for sensitivity"
        ],
        troubleshooting: [
            "Cursor jumping: Clean sensor",
            "Not tracking: Use different surface",
            "Wireless issues: Check battery/receiver"
        ]
    },
    "monitor": {
        title: "Monitor",
        description: "Display screen for visual output",
        tips: [
            "Clean screen with microfiber cloth",
            "Adjust brightness for eye comfort",
            "Use native resolution for best quality",
            "Enable blue light filter for night use"
        ],
        troubleshooting: [
            "No display: Check cables and input source",
            "Flickering: Refresh rate or cable issue",
            "Dead pixels: Run pixel refresh utility"
        ]
    },
    "speakers": {
        title: "Speakers",
        description: "Audio output devices for sound",
        tips: [
            "Position at ear level for best sound",
            "Check audio drivers for issues",
            "Use appropriate size for room",
            "Test with different audio sources"
        ],
        troubleshooting: [
            "No sound: Check volume and connections",
            "Distorted audio: Lower volume or check source",
            "One side not working: Balance settings or hardware"
        ]
    }
};

// Function to get fallback HTML for a component
export function getComponentFallback(component) {
    const data = COMPONENT_FALLBACK_DATA[component];
    if (!data) {
        return `
            <h3>${component}</h3>
            <p>Hardware component detected. No detailed information available.</p>
            <p>This appears to be a computer hardware component that requires specific handling and care.</p>
        `;
    }

    return `
        <h3>${data.title}</h3>
        <p><strong>Description:</strong> ${data.description}</p>
        
        <div class="info-section tips">
            <div class="info-title">💡 Tips & Best Practices</div>
            <ul>
                ${data.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        <div class="info-section">
            <div class="info-title">🔧 Troubleshooting</div>
            <ul>
                ${data.troubleshooting.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
        </div>
        
        <p><em>Note: This is fallback information. For more detailed assistance, consult the component manual or a professional technician.</em></p>
    `;
}
