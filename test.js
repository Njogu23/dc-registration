// test-registration.js
const fetch = require('node-fetch'); // You might need to install this

const testData = {
  paymentCode: "MPESA" + Date.now().toString().slice(-6),
  participants: [
    {
      fullName: "John Kamau",
      email: `john.kamau.${Date.now()}@example.com`,
      designation: "President",
      memberType: "Y's Man",
      club: "Nairobi Club",
      paymentType: "Early Bird Y's Man"
    },
    {
      fullName: "Jane Wanjiru",
      email: `jane.wanjiru.${Date.now()}@example.com`,
      designation: "Secretary",
      memberType: "Y's Youth",
      club: "University of Nairobi Y's Youth",
      paymentType: "Early Bird Y's Youth"
    }
  ]
};

// Calculate total
function calculateTotal(participants) {
  const paymentTypes = {
    "Y's Man": [
      { label: "Early Bird Y's Man", amount: 5000 },
      { label: "Regular Y's Man", amount: 6000 },
      { label: "Late Registration Y's Man", amount: 7000 }
    ],
    "Y's Youth": [
      { label: "Early Bird Y's Youth", amount: 3000 },
      { label: "Regular Y's Youth", amount: 4000 },
      { label: "Late Registration Y's Youth", amount: 5000 }
    ]
  };

  return participants.reduce((total, participant) => {
    const paymentOption = paymentTypes[participant.memberType]?.find(
      pt => pt.label === participant.paymentType
    );
    return total + (paymentOption?.amount || 0);
  }, 0);
}

console.log('Test Data:');
console.log(JSON.stringify(testData, null, 2));
console.log('\nTotal Amount: KES', calculateTotal(testData.participants).toLocaleString());

// Test API call
async function testApi() {
  try {
    console.log('\nSending request to API...');
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    console.log('\nAPI Response Status:', response.status);
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Registration successful!');
      console.log('Confirmation Code:', data.confirmationCode);
    } else {
      console.log('\n❌ Registration failed:', data.error);
    }
    
  } catch (error) {
    console.error('\n❌ Network/API Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. The Next.js dev server is running (npm run dev)');
    console.log('2. The API route exists at /api/register');
    console.log('3. The database is properly set up');
  }
}

// Run the test
testApi();