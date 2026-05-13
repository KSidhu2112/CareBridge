
import axios from 'axios';

const url = "http://localhost:5000";

async function testFetchDeliveryBoys() {
    try {
        // 1. Login as Admin
        const adminCredentials = {
            email: "siddusiddu5849@gmail.com",
            password: "SidhuCarebridge@2112"
        };
        console.log("Logging in as Admin...");
        const loginRes = await axios.post(`${url}/api/user/login`, adminCredentials);

        if (!loginRes.data.success) {
            console.error("❌ Admin login failed:", loginRes.data.message);
            return;
        }

        const token = loginRes.data.token;
        console.log("✅ Admin logged in. Token received.");

        // 2. Fetch Delivery Boys
        console.log("Fetching delivery boys...");
        const response = await axios.get(`${url}/api/user/delivery-boys`, {
            headers: { token }
        });

        if (response.data.success) {
            console.log("✅ SUCCESS: Fetched delivery boys:", response.data.deliveryBoys);
            console.log("Count:", response.data.deliveryBoys.length);
        } else {
            console.log("❌ FAILURE: Could not fetch delivery boys");
            console.log("Message:", response.data.message);
        }

    } catch (error) {
        console.error("❌ ERROR:", error.response ? error.response.data : error.message);
    }
}

testFetchDeliveryBoys();
