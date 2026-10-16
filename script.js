const form = document.getElementById("harvestForm");

const harvestList = document.getElementById("harvestList");
const buyerList = document.getElementById("buyerList");
const buyerMessage = document.getElementById("buyerMessage");

let harvests = JSON.parse(
    localStorage.getItem("harvests") || "[]"
);

const buyers = [
    {
        name: "Green Basket Store",
        crops: ["Tomatoes", "Onions", "Leafy Vegetables"]
    },
    {
        name: "FreshCart Vendor",
        crops: [
            "Tomatoes",
            "Onions",
            "Mangoes",
            "Leafy Vegetables",
            "Chillies"
        ]
    },
    {
        name: "Sunrise Foods",
        crops: ["Tomatoes", "Onions", "Chillies"]
    },
    {
        name: "Village Market Buyer",
        crops: [
            "Tomatoes",
            "Onions",
            "Mangoes",
            "Leafy Vegetables",
            "Chillies"
        ]
    }
];

function saveData() {
    localStorage.setItem(
        "harvests",
        JSON.stringify(harvests)
    );
}

function renderHarvests() {
    harvestList.innerHTML = "";

    harvests.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "harvest-card";

        const title = document.createElement("h3");
        title.textContent = item.crop;

        const details = document.createElement("p");
        details.textContent =
            `Farmer: ${item.farmer} | Location: ${item.location}`;

        const quantity = document.createElement("p");
        quantity.textContent =
            `Quantity: ${item.quantity} kg | Price: ₹${item.price}/kg`;

        const urgency = document.createElement("p");
        urgency.textContent =
            `Urgency: ${item.urgency} | Status: ${item.status}`;

        if (
            item.urgency === "Critical" ||
            item.urgency === "High"
        ) {
            urgency.className = "urgent";
        }

        const findButton = document.createElement("button");
        findButton.textContent = "Find Buyers";
        findButton.addEventListener("click", () => {
            showBuyers(index);
        });

        card.append(title, details, quantity, urgency);

        if (item.status === "Available") {
            const soldButton = document.createElement("button");
            soldButton.textContent = "Mark Sold";

            soldButton.addEventListener("click", () => {
                harvests[index].status = "Sold";
                saveData();
                renderHarvests();
            });

            card.appendChild(findButton);
            card.appendChild(soldButton);
        }

        harvestList.appendChild(card);
    });

    document.getElementById("activeCount").textContent =
        harvests.filter(item => item.status === "Available").length;

    document.getElementById("urgentCount").textContent =
        harvests.filter(item =>
            item.status === "Available" &&
            (item.urgency === "High" ||
             item.urgency === "Critical")
        ).length;
}

function showBuyers(index) {
    const harvest = harvests[index];

    if (harvest.status === "Sold") {
        buyerMessage.textContent =
            "This batch is marked as sold.";
        buyerList.innerHTML = "";
        return;
    }

    const matches = buyers.filter(buyer =>
        buyer.crops.includes(harvest.crop)
    );

    buyerList.innerHTML = "";

    buyerMessage.textContent =
        `Sample matches for ${harvest.crop} near ${harvest.location}.`;

    matches.forEach(buyer => {
        const card = document.createElement("div");
        card.className = "buyer-card";

        const name = document.createElement("h3");
        name.textContent = buyer.name;

        const crop = document.createElement("p");
        crop.textContent =
            `May be interested in: ${harvest.crop}`;

        const note = document.createElement("p");
        note.textContent =
            "Demo buyer only. Contact details have not been verified.";

        card.append(name, crop, note);
        buyerList.appendChild(card);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const harvest = {
        farmer: document.getElementById("farmer").value.trim(),
        crop: document.getElementById("crop").value,
        quantity: Number(
            document.getElementById("quantity").value
        ),
        location: document.getElementById("location").value.trim(),
        price: Number(document.getElementById("price").value),
        urgency: document.getElementById("urgency").value,
        status: "Available"
    };

    if (
        !harvest.farmer ||
        !harvest.location ||
        harvest.quantity <= 0 ||
        harvest.price < 0
    ) {
        alert("Please enter valid harvest details.");
        return;
    }

    harvests.unshift(harvest);

    saveData();
    renderHarvests();

    form.reset();

    alert("Harvest batch published successfully!");
});

renderHarvests();