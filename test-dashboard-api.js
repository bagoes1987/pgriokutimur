async function testDashboardAPI() {
  try {
    console.log("=== Testing Admin Dashboard API ===");
    
    const response = await fetch("http://localhost:3000/api/admin/dashboard");
    
    if (!response.ok) {
      console.log("Response status:", response.status);
      console.log("Response text:", await response.text());
      return;
    }
    
    const data = await response.json();
    console.log("Dashboard API Response:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testDashboardAPI();