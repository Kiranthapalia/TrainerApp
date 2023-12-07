export const fetchCustomers = async () => {
    try {
        const response = await fetch('https://traineeapp.azurewebsites.net/api/customers'.replace("http:", "https:"));
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (data && Array.isArray(data.content)) {
            return data.content;
        } else {
            console.error("Received data does not have a 'content' array:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
