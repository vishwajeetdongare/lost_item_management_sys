document.addEventListener("DOMContentLoaded", () => {
    console.log("JS Loaded ✅");

    const form = document.getElementById("itemForm");

	const today = new Date().toISOString().split("T")[0];
document.getElementById("date").setAttribute("max", today);

    // Form submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            description: document.getElementById("desc").value,
            location: document.getElementById("location").value,
            date: document.getElementById("date").value,
            contact: document.getElementById("contact").value
        };

        console.log("Sending Data:", data);

        try {
            await fetch("http://localhost:5000/add-item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            alert("Item Registered ✅");

            form.reset();

            loadItems();

        } catch (err) {
            console.error("Error:", err);
        }
    });

    loadItems();
});

// Load items
async function loadItems() {
    try {
        const res = await fetch("http://localhost:5000/items");
        const items = await res.json();

        const list = document.getElementById("itemList");
        list.innerHTML = "";

        items.forEach((item) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${item.name}</strong><br>
                📍 Location: ${item.location}<br>
                📅 📅 Date: ${new Date(item.date).toLocaleDateString()}<br>
                📞 Contact: ${item.contact || "N/A"}<br><br>
                <button onclick="deleteItem(${item.id})">Delete</button>
            `;

            list.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading items:", err);
    }
}

// Delete item
async function deleteItem(id) {
    console.log("Deleting:", id);

    try {
        await fetch(`http://localhost:5000/delete-item/${id}`, {
            method: "DELETE"
        });

        alert("Item Deleted ✅");

        loadItems();

    } catch (err) {
        console.error("Delete Error:", err);
    }
}

// Search items
function searchItems() {
    const input = document.getElementById("search").value.toLowerCase();
    const items = document.querySelectorAll("#itemList li");

    items.forEach((item) => {
        const text = item.textContent.toLowerCase();

        if (text.includes(input)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}