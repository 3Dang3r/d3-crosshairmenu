window.addEventListener("message", function(event) {
    const data = event.data;
    if (data.type === "toggleUI") {
        document.getElementById("menu").style.display = data.status ? "block" : "none";
        document.getElementById("customMenu").style.display = "none";
    } else if (data.type === "updateCrosshair") {
        console.log("[NUI] updateCrosshair received:", data);
        const img = document.getElementById("crosshairImg");
        if (data.show && data.image) {
            img.style.display = "block";
            img.src = data.image;
            // Convert size from 1-10 scale (from client) to vw scale
            // Client sends size roughly 0.01-0.10, so use it directly
            img.style.width = (data.size * 100) + "vw";
            img.style.height = "auto";
        } else {
            img.style.display = "none";
            img.src = "";
        }
    }
});

function closeMenu() {
    fetch(`https://${GetParentResourceName()}/closeUI`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
}

function openCustomMenu() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("customMenu").style.display = "block";
}

function backToMainMenu() {
    document.getElementById("customMenu").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function setCustom(isCustom) {
    fetch(`https://${GetParentResourceName()}/setCrosshair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom: isCustom }),
    });
    closeMenu();
}

function confirmCustom() {
    const imageUrl = document.getElementById("imageUrl").value.trim();
    const sizeValue = document.getElementById("sizeRange").value.trim();

    if (!imageUrl) {
        alert("Please enter an image URL.");
        return;
    }

    // Basic validation for image extension
    if (!imageUrl.match(/\.(png|jpg|jpeg|svg)$/i)) {
        alert("Please enter a valid image URL ending with .png, .jpg, .jpeg or .svg");
        return;
    }

    fetch(`https://${GetParentResourceName()}/setCrosshair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            custom: true,
            image: imageUrl,
            size: (sizeValue / 100).toFixed(3) // normalize size for client (0.01 to 0.10)
        }),
    });
    closeMenu();
}
