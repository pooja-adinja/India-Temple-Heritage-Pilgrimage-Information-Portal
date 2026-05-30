const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');

dotenv.config();

const temples = [
  {
    name: "Tirupati Balaji Temple",
    state: "Andhra Pradesh",
    city: "Tirupati",
    history: "One of the most visited religious sites in the world, dedicated to Lord Venkateswara.",
    significance: "Major Vaishnava pilgrimage site",
    deities: ["Lord Venkateswara"],
    darshanTimings: "2:30 AM - 1:30 AM (next day)",
    status: "approved",
    isFeatured: true
  },
  {
    name: "Kedarnath Temple",
    state: "Uttarakhand",
    city: "Kedarnath",
    history: "Ancient Shiva temple in the Himalayas, part of the Char Dham pilgrimage.",
    significance: "One of the twelve Jyotirlingas",
    deities: ["Lord Shiva"],
    darshanTimings: "4:00 AM - 9:00 PM",
    status: "approved",
    isFeatured: true
  },
  {
    name: "Golden Temple",
    state: "Punjab",
    city: "Amritsar",
    history: "The holiest shrine in Sikhism, also known as Harmandir Sahib.",
    significance: "Most sacred Gurdwara of Sikhism",
    deities: ["Sri Guru Granth Sahib"],
    darshanTimings: "Open 24 hours",
    status: "approved",
    isFeatured: true
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    await Temple.deleteMany({});
    console.log('🗑️  Old temples cleared');
    await Temple.insertMany(temples);
    console.log('✅ Temples inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seed();