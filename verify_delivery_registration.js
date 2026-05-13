
import axios from 'axios';

const url = "https://carebridge-auom.onrender.com";

async function testRegistration() {
    try {
        const testUser = {
            name: "Test Delivery Boy",
            email: `test_delivery_${Date.now()}@example.com`,
            password: "password123",
            role: "delivery_boy"
        };

        console.log("Registering user:", testUser);
        const response = await axios.post(`${url}/api/user/register`, testUser);

        console.log("Response:", response.data);

        if (response.data.success && response.data.role === 'delivery_boy') {
            console.log("✅ SUCCESS: User registered as delivery_boy");
        } else {
            console.log("❌ FAILURE: User registered but role is mismatch or success is false");
            console.log("Role received:", response.data.role);
        }

    } catch (error) {
        console.error("❌ ERROR:", error.response ? error.response.data : error.message);
    }
}

testRegistration();
