const mongoose = require('mongoose');
require('dotenv').config();
const Temple = require('./models/Temple');

const temples = [
  {
    name: 'Vaishno Devi Temple',
    city: 'Katra',
    state: 'Jammu & Kashmir',
    history: 'One of the most visited Hindu shrines in India, dedicated to Goddess Vaishno Devi. Located in the Trikuta Mountains at an altitude of 5200 feet.',
    significance: 'Major Shakti Peetha pilgrim site visited by millions annually',
    deities: ['Goddess Vaishno Devi', 'Maa Kali', 'Maa Saraswati', 'Maa Lakshmi'],
    darshanTimings: 'Open 24 hours',
    dressCode: 'Modest traditional attire preferred',
    visitorGuidelines: 'Yatra slip mandatory. No non-vegetarian food or alcohol. Mobile phones not allowed inside cave.',
    nearbyFacilities: 'Helicopter service available. Hotels in Katra. Medical facilities available on route.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Somnath Temple',
    city: 'Somnath',
    state: 'Gujarat',
    history: 'One of the twelve Jyotirlinga shrines of Lord Shiva. Mentioned in ancient texts like Shiva Purana. The temple has been destroyed and rebuilt several times throughout history.',
    significance: 'First of the twelve Jyotirlingas, eternal shrine on the shores of Arabian Sea',
    deities: ['Lord Shiva', 'Jyotirlinga'],
    darshanTimings: '6:00 AM - 9:30 PM',
    dressCode: 'Traditional attire required. No shorts or sleeveless.',
    visitorGuidelines: 'Photography prohibited inside temple. Remove footwear at entrance.',
    nearbyFacilities: 'Hotels nearby. Somnath beach accessible. Airport at Diu.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Meenakshi Amman Temple',
    city: 'Madurai',
    state: 'Tamil Nadu',
    history: 'An ancient Hindu temple dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva). Built by the Pandya kings, it is a masterpiece of Dravidian architecture with 14 gopurams.',
    significance: 'One of the greatest temples of India, a UNESCO tentative World Heritage Site',
    deities: ['Goddess Meenakshi', 'Lord Sundareswarar', 'Lord Shiva'],
    darshanTimings: '5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM',
    dressCode: 'Traditional attire mandatory. Dhoti for men, saree/salwar for women.',
    visitorGuidelines: 'Non-Hindus allowed in outer premises. Camera fee applicable.',
    nearbyFacilities: 'Hotels around temple. Madurai railway station nearby.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Jagannath Temple',
    city: 'Puri',
    state: 'Odisha',
    history: 'One of the Char Dham pilgrimage sites dedicated to Lord Jagannath (Vishnu). Famous for the annual Rath Yatra chariot festival. The temple kitchen is said to feed thousands daily.',
    significance: 'One of the four sacred dhams, Char Dham pilgrimage site',
    deities: ['Lord Jagannath', 'Balabhadra', 'Subhadra'],
    darshanTimings: '5:00 AM - 11:00 PM',
    dressCode: 'Traditional attire. Non-Hindus not allowed inside the main temple.',
    visitorGuidelines: 'Only Hindus allowed inside. Leather items not permitted.',
    nearbyFacilities: 'Puri beach nearby. Hotels available. Railway connectivity.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Shirdi Sai Baba Temple',
    city: 'Shirdi',
    state: 'Maharashtra',
    history: 'Shrine dedicated to Sai Baba of Shirdi, a spiritual master revered by both Hindus and Muslims. Attracts over 25,000 devotees daily making it one of the richest temples in India.',
    significance: 'Major pilgrimage site transcending religious boundaries',
    deities: ['Sai Baba'],
    darshanTimings: '4:00 AM - 11:00 PM',
    dressCode: 'Modest clothing required',
    visitorGuidelines: 'Token system for darshan. Online booking available.',
    nearbyFacilities: 'Prasadalaya (free food). Hotels. Regular buses from Nashik and Pune.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Siddhivinayak Temple',
    city: 'Mumbai',
    state: 'Maharashtra',
    history: 'Built in 1801, this temple dedicated to Lord Ganesha is one of the most visited temples in Mumbai. The main idol is carved from a single black stone.',
    significance: 'Most famous Ganesha temple in Maharashtra, visited by celebrities and devotees alike',
    deities: ['Lord Ganesha', 'Siddhivinayak'],
    darshanTimings: '5:30 AM - 10:00 PM',
    dressCode: 'Modest attire. No shorts.',
    visitorGuidelines: 'VIP darshan pass available online. No mobile phones inside.',
    nearbyFacilities: 'Dadar station nearby. Multiple hotels. Prasad available.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Brihadeeswara Temple',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    history: 'Built by Raja Raja Chola I in 1010 AD, this UNESCO World Heritage Site is a masterpiece of Dravidian architecture. The temple tower (vimana) rises 66 meters and casts no shadow at noon.',
    significance: 'UNESCO World Heritage Site, greatest Chola architectural achievement',
    deities: ['Lord Shiva', 'Brihadeeswara'],
    darshanTimings: '6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM',
    dressCode: 'Traditional attire preferred',
    visitorGuidelines: 'Photography allowed in outer areas. Entry fee for foreigners.',
    nearbyFacilities: 'Thanjavur city center. Hotels available. Museum nearby.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Kashi Vishwanath Temple',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    history: 'One of the most sacred temples dedicated to Lord Shiva, located on the western bank of the Ganges. One of the twelve Jyotirlingas. The current structure was built by Ahilya Bai Holkar in 1780.',
    significance: 'Most sacred Shiva temple, one of twelve Jyotirlingas in holy city of Varanasi',
    deities: ['Lord Shiva', 'Vishwanath', 'Jyotirlinga'],
    darshanTimings: '3:00 AM - 11:00 PM',
    dressCode: 'Traditional Indian attire mandatory',
    visitorGuidelines: 'Mobile phones not allowed. Security check mandatory. Non-Hindus restricted.',
    nearbyFacilities: 'Kashi Vishwanath Corridor. Ghat nearby. Hotels in Varanasi.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Ramanathaswamy Temple',
    city: 'Rameswaram',
    state: 'Tamil Nadu',
    history: 'One of the Char Dham pilgrimage sites, this temple is dedicated to Lord Shiva. It has the longest corridor among all Hindu temples in India, stretching over 1200 meters.',
    significance: 'One of the Char Dhams, longest temple corridor in India',
    deities: ['Lord Shiva', 'Ramanathaswamy', 'Parvathi'],
    darshanTimings: '5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM',
    dressCode: 'Dhoti for men, saree for women inside temple',
    visitorGuidelines: 'Pilgrims must bathe in 22 temple wells. Photography restricted.',
    nearbyFacilities: 'Pamban bridge nearby. Hotels. Agni Theertham beach.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Padmanabhaswamy Temple',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    history: 'One of the 108 Divya Desams dedicated to Lord Vishnu in the reclining position (Ananthasayana). The temple vault is said to contain one of the largest treasure hoards in the world.',
    significance: 'Wealthiest temple in the world, ancient Divya Desam',
    deities: ['Lord Vishnu', 'Padmanabha', 'Lakshmi'],
    darshanTimings: '3:30 AM - 12:00 PM, 5:00 PM - 8:30 PM',
    dressCode: 'Strict dress code: Dhoti for men, saree for women. No western attire.',
    visitorGuidelines: 'Only Hindus allowed. Strict dress code enforced. No camera.',
    nearbyFacilities: 'Thiruvananthapuram city. Airport nearby. Hotels.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Lingaraj Temple',
    city: 'Bhubaneswar',
    state: 'Odisha',
    history: 'One of the oldest and largest temples in Bhubaneswar, built in the 11th century. Dedicated to Lord Tribhuvaneswar (Shiva). A masterpiece of Kalinga architecture.',
    significance: 'Largest temple in Bhubaneswar, finest example of Kalinga architecture',
    deities: ['Lord Shiva', 'Tribhuvaneswar', 'Parvathi'],
    darshanTimings: '6:00 AM - 9:00 PM',
    dressCode: 'Traditional attire. Non-Hindus not allowed inside.',
    visitorGuidelines: 'Non-Hindus can view from designated platform. No leather items.',
    nearbyFacilities: 'Bhubaneswar city. Airport. Bindu Sagar lake nearby.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Mahakaleshwar Temple',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    history: 'One of the twelve Jyotirlingas, the Mahakaleshwar idol is unique as it is swayambhu (self-manifested). Famous for the Bhasma Aarti performed at dawn with sacred ash.',
    significance: 'One of twelve Jyotirlingas, famous for unique Bhasma Aarti ritual',
    deities: ['Lord Shiva', 'Mahakaleshwar', 'Jyotirlinga'],
    darshanTimings: '4:00 AM - 11:00 PM',
    dressCode: 'Traditional attire preferred',
    visitorGuidelines: 'Bhasma Aarti booking required in advance. Photography restricted inside.',
    nearbyFacilities: 'Ujjain city. Kshipra river ghats. Hotels available.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Dwarkadhish Temple',
    city: 'Dwarka',
    state: 'Gujarat',
    history: 'One of the four sacred Char Dham pilgrimage sites, dedicated to Lord Krishna as Dwarkadhish (King of Dwarka). The five-story temple dates back to the 16th century built on a site believed to be Krishna\'s ancient kingdom.',
    significance: 'One of the four Char Dhams, sacred site of Lord Krishna',
    deities: ['Lord Krishna', 'Dwarkadhish', 'Radha'],
    darshanTimings: '6:30 AM - 1:00 PM, 5:00 PM - 9:30 PM',
    dressCode: 'Traditional Indian attire. No western clothing.',
    visitorGuidelines: 'Non-Hindus allowed in outer premises only. Security check mandatory.',
    nearbyFacilities: 'Dwarka beach. Hotels. Bet Dwarka island nearby.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Badrinath Temple',
    city: 'Badrinath',
    state: 'Uttarakhand',
    history: 'One of the Char Dham pilgrimage sites dedicated to Lord Vishnu. Located at an altitude of 3133 meters in the Garhwal Himalayas. Open only for 6 months a year due to harsh winters.',
    significance: 'One of the four Char Dhams, sacred Vishnu shrine in the Himalayas',
    deities: ['Lord Vishnu', 'Badrinath', 'Lakshmi'],
    darshanTimings: '4:30 AM - 9:00 PM (May to November only)',
    dressCode: 'Warm traditional attire. Cold climate — carry woolens.',
    visitorGuidelines: 'Temple opens in May and closes in November. Medical fitness advised.',
    nearbyFacilities: 'Tapt Kund hot spring. Mana village nearby. Limited hotels.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Gangotri Temple',
    city: 'Gangotri',
    state: 'Uttarakhand',
    history: 'Part of the Char Dham pilgrimage, this temple is dedicated to Goddess Ganga. Located at 3100 meters, it marks the site where King Bhagirath meditated to bring the Ganges to Earth.',
    significance: 'Origin of sacred river Ganga, one of the Char Dhams',
    deities: ['Goddess Ganga', 'Goddess Bhagirathi'],
    darshanTimings: '6:15 AM - 2:00 PM, 3:00 PM - 9:30 PM (May to November)',
    dressCode: 'Warm traditional attire',
    visitorGuidelines: 'Open May to November. Gangotri glacier trek available nearby.',
    nearbyFacilities: 'Basic accommodation. Bhojbasa camp for trekkers.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Yamunotri Temple',
    city: 'Yamunotri',
    state: 'Uttarakhand',
    history: 'The westernmost shrine of the Char Dham pilgrimage dedicated to Goddess Yamuna. Located at 3293 meters, accessible only by trekking 6 km from Janki Chatti.',
    significance: 'Source of sacred river Yamuna, one of the Char Dhams',
    deities: ['Goddess Yamuna', 'Goddess Ganga'],
    darshanTimings: '6:00 AM - 9:00 PM (May to November)',
    dressCode: 'Warm traditional attire',
    visitorGuidelines: 'Only reachable by 6 km trek. Open May to November only.',
    nearbyFacilities: 'Janki Chatti base camp. Surya Kund hot spring at temple.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Nataraja Temple',
    city: 'Chidambaram',
    state: 'Tamil Nadu',
    history: 'Ancient temple dedicated to Lord Shiva in the form of Nataraja (cosmic dancer). One of the Pancha Bhuta Stalas representing the element of space (Akasha). Over 2000 years old.',
    significance: 'One of five Pancha Bhuta Stalas, most important Shiva dance form temple',
    deities: ['Lord Shiva', 'Nataraja', 'Goddess Shivakami'],
    darshanTimings: '6:00 AM - 12:00 PM, 5:00 PM - 10:00 PM',
    dressCode: 'Traditional attire. Dhoti for men.',
    visitorGuidelines: 'Photography fee applicable. Brahmin priests conduct rituals.',
    nearbyFacilities: 'Chidambaram town. Pichavaram mangrove forest nearby.',
    isFeatured: false,
    status: 'approved'
  },
  {
    name: 'Kamakhya Temple',
    city: 'Guwahati',
    state: 'Assam',
    history: 'One of the most important Shakti Peethas dedicated to Goddess Kamakhya. Located on Nilachal Hill, the temple is known for the Ambubachi Mela celebrating the goddess\'s annual menstruation.',
    significance: 'Most important Shakti Peetha in Northeast India, Tantric worship center',
    deities: ['Goddess Kamakhya', 'Goddess Durga', 'Goddess Kali'],
    darshanTimings: '8:00 AM - 1:00 PM, 2:30 PM - 5:30 PM',
    dressCode: 'Modest traditional attire',
    visitorGuidelines: 'Temple closes during Ambubachi. Long queues — arrive early.',
    nearbyFacilities: 'Guwahati city. Airport nearby. Brahmaputra river.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Ranganathaswamy Temple',
    city: 'Srirangam',
    state: 'Tamil Nadu',
    history: 'The largest functioning Hindu temple complex in the world covering 156 acres. Dedicated to Lord Ranganatha (Vishnu), it has 21 gopurams and 7 enclosures. One of the 108 Divya Desams.',
    significance: 'Largest Hindu temple complex in the world, most important Vishnu temple',
    deities: ['Lord Vishnu', 'Ranganatha', 'Goddess Ranganayaki'],
    darshanTimings: '6:00 AM - 1:00 PM, 3:15 PM - 9:00 PM',
    dressCode: 'Dhoti for men, saree for women inside inner sanctum',
    visitorGuidelines: 'Non-Hindus allowed in outer enclosures only. Photography in outer areas.',
    nearbyFacilities: 'Trichy city. Airport. Cauvery river adjacent.',
    isFeatured: true,
    status: 'approved'
  },
  {
    name: 'Trimbakeshwar Temple',
    city: 'Trimbak',
    state: 'Maharashtra',
    history: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, located near the source of the Godavari river. The unique feature is its three-faced lingam representing Brahma, Vishnu and Shiva.',
    significance: 'One of twelve Jyotirlingas, source of sacred Godavari river',
    deities: ['Lord Shiva', 'Trimbakeshwar', 'Jyotirlinga'],
    darshanTimings: '5:30 AM - 9:00 PM',
    dressCode: 'Dhoti mandatory for men inside sanctum. No pants allowed.',
    visitorGuidelines: 'Women not allowed inside inner sanctum. Photography prohibited.',
    nearbyFacilities: 'Nashik city 28 km away. Hotels in Trimbak. Brahmagiri hill trek.',
    isFeatured: false,
    status: 'approved'
  }
];

const seedTemples = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);

        let added = 0;
        let skipped = 0;

        for (const templeData of temples) {
            const exists = await Temple.findOne({ name: templeData.name });
            if (exists) {
                console.log(`⚠️  Skipped (already exists): ${templeData.name}`);
                skipped++;
            } else {
                await Temple.create(templeData);
                console.log(`✅ Added: ${templeData.name}`);
                added++;
            }
        }

        console.log(`\n🎉 Done! Added ${added} temples, skipped ${skipped} duplicates.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

seedTemples();