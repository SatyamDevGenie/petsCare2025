const pets = [
  {
    name: "Shadow",
    type: "Dog",
    breed: "German Shepherd",
    age: 5,
    gender: "Male",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-09-10"),
        nextDueDate: new Date("2024-09-10"),
      },
      {
        vaccineName: "Distemper",
        dateAdministered: new Date("2023-08-05"),
        nextDueDate: new Date("2024-08-05"),
      },
      {
        vaccineName: "Parvovirus",
        dateAdministered: new Date("2023-07-01"),
        nextDueDate: new Date("2024-07-01"),
      },
    ],
    isNeutered: true,
    notes:
      "Highly intelligent and energetic, Shadow excels in obedience training and agility courses. He is very protective of his family and enjoys playing fetch. Regular exercise is a must to keep him happy and healthy. He responds well to positive reinforcement and enjoys learning new tricks.",
    image: "/images/shepherd.png",
  },

  {
    name: "Bella",
    type: "Dog",
    breed: "Labrador Retriever",
    age: 2,
    gender: "Female",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-10-05"),
        nextDueDate: new Date("2024-10-05"),
      },
      {
        vaccineName: "Distemper",
        dateAdministered: new Date("2023-09-01"),
        nextDueDate: new Date("2024-09-01"),
      },
      {
        vaccineName: "Parvovirus",
        dateAdministered: new Date("2023-08-20"),
        nextDueDate: new Date("2024-08-20"),
      },
    ],
    isNeutered: true,
    notes:
      "Bella is a friendly and outgoing dog who loves to be around people. She enjoys swimming and playing fetch, especially with her favorite tennis ball. She is great with kids and other pets, making her a perfect family companion. Her high energy levels require daily walks and playtime.",
    image: "/images/labrodor.png",
  },

  {
    name: "Max",
    type: "Cat",
    breed: "Maine Coon",
    age: 3,
    gender: "Female",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-09-12"),
        nextDueDate: new Date("2024-09-12"),
      },
      {
        vaccineName: "Feline Distemper",
        dateAdministered: new Date("2023-08-15"),
        nextDueDate: new Date("2024-08-15"),
      },
      {
        vaccineName: "Feline Leukemia",
        dateAdministered: new Date("2023-07-10"),
        nextDueDate: new Date("2024-07-10"),
      },
    ],
    isNeutered: true,
    notes:
      "Max is a gentle and affectionate Maine Coon who enjoys lounging by the window and observing birds outside. She loves playing with feather toys and chasing laser pointers. Her long fur requires regular grooming to prevent matting. She is independent but enjoys occasional cuddles.",
    image: "/images/max.png",
  },

  {
    name: "Milo",
    type: "Cat",
    breed: "Siamese",
    age: 2,
    gender: "Female",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-11-01"),
        nextDueDate: new Date("2024-11-01"),
      },
      {
        vaccineName: "Feline Distemper",
        dateAdministered: new Date("2023-10-10"),
        nextDueDate: new Date("2024-10-10"),
      },
      {
        vaccineName: "Feline Herpesvirus",
        dateAdministered: new Date("2023-09-20"),
        nextDueDate: new Date("2024-09-20"),
      },
    ],
    isNeutered: true,
    notes:
      "Milo is very vocal and loves attention. She enjoys climbing on furniture, exploring new places, and playing with interactive toys. She follows her owner around the house and often 'talks' to them with her meows. She forms strong bonds with her favorite humans and loves warm cozy spots.",
    image: "/images/milo.png",
  },

  {
    name: "Luna",
    type: "Cat",
    breed: "Sphynx",
    age: 4,
    gender: "Female",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-03-10"),
        nextDueDate: new Date("2024-03-10"),
      },
      {
        vaccineName: "Feline Distemper",
        dateAdministered: new Date("2023-02-15"),
        nextDueDate: new Date("2024-02-15"),
      },
      {
        vaccineName: "Feline Calicivirus",
        dateAdministered: new Date("2023-01-25"),
        nextDueDate: new Date("2024-01-25"),
      },
    ],
    isNeutered: true,
    notes:
      "Luna is an affectionate and curious Sphynx cat who loves cuddles and warmth. Due to her lack of fur, she needs regular skin care, including baths to remove excess oils. She enjoys wearing cozy sweaters during colder months and loves to burrow under blankets. She thrives on companionship and prefers not to be left alone for long periods.",
    image: "/images/sphynx.png",
  },

  {
    name: "Prince",
    type: "Dog",
    breed: "Rottweiler",
    age: 4,
    gender: "Male",
    vaccinationRecords: [
      {
        vaccineName: "Rabies",
        dateAdministered: new Date("2023-06-20"),
        nextDueDate: new Date("2024-06-20"),
      },
      {
        vaccineName: "Distemper",
        dateAdministered: new Date("2023-05-15"),
        nextDueDate: new Date("2024-05-15"),
      },
    ],
    isNeutered: false,
    notes:
      "Prince is a loyal and protective Rottweiler who forms strong bonds with his family. He is highly intelligent and thrives on training sessions. He enjoys long walks and requires proper socialization from an early age. While he can be reserved around strangers, he is incredibly affectionate with those he trusts. Regular exercise and mental stimulation are essential for his well-being.",
    image: "/images/Rotweiler.png",
  },

  {
    name: "Cooper",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    vaccinationRecords: [
      { vaccineName: "Rabies", dateAdministered: new Date("2024-01-15"), nextDueDate: new Date("2025-01-15") },
      { vaccineName: "Distemper", dateAdministered: new Date("2024-01-15"), nextDueDate: new Date("2025-01-15") },
      { vaccineName: "Parvovirus", dateAdministered: new Date("2024-01-15"), nextDueDate: new Date("2025-01-15") },
    ],
    isNeutered: true,
    notes: "Cooper is a gentle, intelligent Golden Retriever who loves everyone he meets. Perfect for families with children, he enjoys fetch, swimming, and outdoor adventures. His friendly nature and eagerness to please make him an ideal therapy and family dog. Regular grooming keeps his beautiful coat shiny and healthy.",
    image: "/images/labrodor.png",
  },
  {
    name: "Daisy",
    type: "Dog",
    breed: "Beagle",
    age: 2,
    gender: "Female",
    vaccinationRecords: [
      { vaccineName: "Rabies", dateAdministered: new Date("2023-11-20"), nextDueDate: new Date("2024-11-20") },
      { vaccineName: "Distemper", dateAdministered: new Date("2023-11-20"), nextDueDate: new Date("2024-11-20") },
    ],
    isNeutered: true,
    notes: "Daisy is a curious and cheerful Beagle with a love for sniffing and exploring. She is great with kids and other dogs, and her compact size makes her perfect for apartment living. She enjoys puzzle toys and scent games. Her friendly bark and wagging tail bring joy to every household.",
    image: "/images/shepherd.png",
  },
  {
    name: "Oliver",
    type: "Cat",
    breed: "British Shorthair",
    age: 4,
    gender: "Male",
    vaccinationRecords: [
      { vaccineName: "Rabies", dateAdministered: new Date("2023-12-01"), nextDueDate: new Date("2024-12-01") },
      { vaccineName: "Feline Distemper", dateAdministered: new Date("2023-11-15"), nextDueDate: new Date("2024-11-15") },
    ],
    isNeutered: true,
    notes: "Oliver is a calm, dignified British Shorthair with a plush blue-gray coat. He enjoys quiet companionship and is content watching the world from a sunny windowsill. Low-maintenance and affectionate on his own terms, he is ideal for busy professionals. His round face and sweet expression make him irresistible.",
    image: "/images/max.png",
  },
  {
    name: "Charlie",
    type: "Bird",
    breed: "Budgerigar",
    age: 1,
    gender: "Male",
    vaccinationRecords: [
      { vaccineName: "Avian Polyomavirus", dateAdministered: new Date("2024-02-01"), nextDueDate: new Date("2025-02-01") },
    ],
    isNeutered: false,
    notes: "Charlie is a lively and social budgie who loves to chirp and mimic sounds. He thrives on interaction, toys, and a varied diet of seeds and fresh veggies. With proper care and attention, he can learn words and tricks. A cheerful companion perfect for bird enthusiasts.",
    image: "/images/milo.png",
  },
];

export default pets;
