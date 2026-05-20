import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [token, setToken] = useState("");
  const [menu, setMenu] = useState([]);
  const [orders,setOrders]=useState(null);
  const [orderId, setOrderId] = useState(null);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const url = window.location.hostname === 'localhost' ? 'http://localhost:5000' : "https://carebridge-auom.onrender.com";

  // ✅ Safe quantity calculation
  useEffect(() => {
    if (!cartItems || typeof cartItems !== "object") {
      setTotalQuantity(0);
      return;
    }

    let total = 0;
    for (const item in cartItems) {
      total += cartItems[item];
    }
    setTotalQuantity(total);
  }, [cartItems]);

  // Load menu + token + cart
  useEffect(() => {
    async function loadData() {
      await getALLMenu();

      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
        setRole(localStorage.getItem("userRole") || "");
        setUserName(localStorage.getItem("userName") || "");
        setUserEmail(localStorage.getItem("userEmail") || "");

        // Fetch up-to-date user profile from backend
        try {
          const profileRes = await axios.get(url + "/api/user/get-profile", {
            headers: { token: storedToken }
          });
          if (profileRes.data.success && profileRes.data.user) {
            setRole(profileRes.data.user.role);
            setUserName(profileRes.data.user.name);
            setUserEmail(profileRes.data.user.email);
            localStorage.setItem("userRole", profileRes.data.user.role);
            localStorage.setItem("userName", profileRes.data.user.name);
            localStorage.setItem("userEmail", profileRes.data.user.email);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }

        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const getALLMenu = async () => {
    const res = await axios.get(url + "/api/donation/getAll");
    setMenu(res.data.data || []);
  };

  const loadCartData = async (token) => {
    const res = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(res.data.cart || {}); // ✅ critical fix
  };

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;

      if (prev[itemId] === 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const contextvalue = {
    menu,
    cartItems,
    addToCart,
    removeFromCart,
    url,
    token,
    setToken,
    totalQuantity,
    orders,setOrders,
    orderId, setOrderId,
    role, setRole,
    userName, setUserName,
    userEmail, setUserEmail
  };

  return (
    <StoreContext.Provider value={contextvalue}>
      {props.children}
    </StoreContext.Provider>
  );
};
