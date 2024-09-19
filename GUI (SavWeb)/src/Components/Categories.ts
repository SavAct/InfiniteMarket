export interface Category {
  name: string;
  index: number;
  child?: Category[];
}

// Note: Start counting by one to prevent confusion with account names on API requests, because 0x0100000000000000 = 72057594037927936 is as string longer than any account name
export const categories: Array<Category> = [
  {
    name: "Motors",
    index: 1,
    child: [
      { index: 1, name: "Auto Parts & Accessories", child: [] },
      { index: 2, name: "Other Vehicles & Trailers", child: [] },
      { index: 3, name: "Motorcycles", child: [] },
      { index: 4, name: "Automotive Tools & Supplies", child: [] },
      { index: 5, name: "Powersport Vehicles", child: [] },
      { index: 6, name: "Boats", child: [] },
      { index: 7, name: "Top Vehicle Makes", child: [] },
    ],
  },
  {
    name: "Electronics",
    index: 2,
    child: [
      { index: 1, name: "Computers, Tablets & Network Hardware", child: [] },
      { index: 2, name: "Cell Phones, Smart Watches & Accessories", child: [] },
      { index: 3, name: "Video Games & Consoles", child: [] },
      { index: 4, name: "Cameras & Photo", child: [] },
      { index: 5, name: "TV, Video & Home Audio Electronics", child: [] },
      { index: 6, name: "Vehicle Electronics & GPS", child: [] },
      { index: 7, name: "Portable Audio & Headphones", child: [] },
      { index: 8, name: "Major Appliances, Parts & Accessories", child: [] },
      { index: 9, name: "Surveillance & Smart Home Electronics", child: [] },
      { index: 10, name: "Home Surveillance Systems", child: [] },
    ],
  },
  {
    name: "Collectibles & Art",
    index: 3,
    child: [
      { index: 1, name: "Collectibles", child: [] },
      {
        index: 2,
        name: "Sports Memorabilia, Fan Shop & Sports Cards",
        child: [],
      },
      { index: 3, name: "Coins & Paper Money", child: [] },
      { index: 4, name: "Dolls & Teddy Bears", child: [] },
      { index: 5, name: "Antiques", child: [] },
      { index: 6, name: "Art & Craft Supplies", child: [] },
      { index: 7, name: "Art", child: [] },
      { index: 8, name: "Pottery & Glass", child: [] },
      { index: 9, name: "Entertainment Memorabilia", child: [] },
      { index: 10, name: "Vintage & Antique Jewelry", child: [] },
      { index: 11, name: "Stamps", child: [] },
    ],
  },
  {
    name: "Home & Garden",
    index: 4,
    child: [
      { index: 1, name: "Home Decor", child: [] },
      { index: 2, name: "Yard, Garden & Outdoor Living Items", child: [] },
      { index: 3, name: "Kitchen, Dining & Bar Supplies", child: [] },
      { index: 4, name: "Tools & Workshop Equipment", child: [] },
      { index: 5, name: "Home Furniture", child: [] },
      { index: 6, name: "Home Improvement", child: [] },
      { index: 7, name: "Major Appliances, Parts & Accessories", child: [] },
      { index: 8, name: "Household & Cleaning Supplies", child: [] },
      { index: 9, name: "Bedding", child: [] },
      { index: 10, name: "Lamps, Lighting & Ceiling Fans", child: [] },
      { index: 11, name: "Food & Beverages", child: [] },
      { index: 12, name: "Surveillance & Smart Home Electronics", child: [] },
      { index: 13, name: "Holiday & Seasonal Decor", child: [] },
      {
        index: 14,
        name: "Bathroom Fixtures, Accessories & Supplies",
        child: [],
      },
      { index: 15, name: "Greeting Cards & Party Supplies", child: [] },
      { index: 16, name: "Candles & Home Fragrance", child: [] },
      { index: 17, name: "Rugs & Carpets", child: [] },
      { index: 18, name: "Window Treatments & Hardware", child: [] },
    ],
  },
  {
    name: "Clothing, Shoes & Accessories",
    index: 5,
    child: [
      { index: 1, name: "Action Figures & Accessories", child: [] },
      { index: 2, name: "Collectible Card Games & Accessories", child: [] },
      { index: 3, name: "Video Games", child: [] },
      { index: 4, name: "Diecast & Toy Vehicles", child: [] },
      { index: 5, name: "Building Toys", child: [] },
      { index: 6, name: "Games", child: [] },
      { index: 7, name: "Model Trains", child: [] },
      { index: 8, name: "RC Model Vehicles, Toys & Control Line", child: [] },
      { index: 9, name: "Toy Models & Kits", child: [] },
      { index: 10, name: "Preschool Toys & Pretend Play", child: [] },
      { index: 11, name: "Stuffed Animals", child: [] },
      { index: 12, name: "Vintage & Antique Toys", child: [] },
      { index: 13, name: "Outdoor Toys & Structures", child: [] },
      { index: 14, name: "Beanbag Plushies", child: [] },
      { index: 15, name: "Electronic, Battery & Wind-Up Toys", child: [] },
      { index: 16, name: "Slot Cars", child: [] },
    ],
  },
  {
    name: "Toys & Hobbies",
    index: 6,
    child: [
      {
        index: 1,
        name: "Sports Memorabilia, Fan Shop & Sports Cards",
        child: [],
      },
      { index: 2, name: "Hunting Equipment", child: [] },
      { index: 3, name: "Golf Equipment", child: [] },
      { index: 4, name: "Cycling Equipment", child: [] },
      { index: 5, name: "Outdoor Sports", child: [] },
      { index: 6, name: "Fishing Equipment & Supplies", child: [] },
      { index: 7, name: "Team Sports", child: [] },
      { index: 8, name: "Camping & Hiking Equipment", child: [] },
      { index: 9, name: "Fitness, Running & Yoga Equipment", child: [] },
      { index: 10, name: "Winter Sports", child: [] },
      { index: 11, name: "Water Sports", child: [] },
      { index: 12, name: "Indoor Games", child: [] },
      { index: 13, name: "Tactical & Duty Gear", child: [] },
      { index: 14, name: "Tennis & Racquet Sports", child: [] },
      { index: 15, name: "Boxing & MMA Equipment", child: [] },
    ],
  },
  {
    name: "Sporting Goods",
    index: 7,
    child: [
      {
        index: 1,
        name: "Sports Memorabilia, Fan Shop & Sports Cards",
        child: [],
      },
      { index: 2, name: "Hunting Equipment", child: [] },
      { index: 3, name: "Golf Equipment", child: [] },
      { index: 4, name: "Cycling Equipment", child: [] },
      { index: 5, name: "Outdoor Sports", child: [] },
      { index: 6, name: "Fishing Equipment & Supplies", child: [] },
      { index: 7, name: "Team Sports", child: [] },
      { index: 8, name: "Camping & Hiking Equipment", child: [] },
      { index: 9, name: "Fitness, Running & Yoga Equipment", child: [] },
      { index: 10, name: "Winter Sports", child: [] },
      { index: 11, name: "Water Sports", child: [] },
      { index: 12, name: "Indoor Games", child: [] },
      { index: 13, name: "Tactical & Duty Gear", child: [] },
      { index: 14, name: "Tennis & Racquet Sports", child: [] },
      { index: 15, name: "Boxing & MMA Equipment", child: [] },
      { index: 16, name: "Top Brands", child: [] },
      { index: 17, name: "Popular Topics", child: [] },
      { index: 18, name: "Top Stores", child: [] },
    ],
  },
  {
    name: "Books, Movies & Music",
    index: 8,
    child: [
      { index: 1, name: "Books & Magazines", child: [] },
      { index: 2, name: "Musical Instruments & Gear", child: [] },
      { index: 3, name: "Music", child: [] },
      { index: 4, name: "Movies & TV", child: [] },
    ],
  },
  {
    name: "Health & Beauty",
    index: 9,
    child: [
      { index: 1, name: "Fragrances", child: [] },
      { index: 2, name: "Hair Care & Styling Products", child: [] },
      { index: 3, name: "Vitamins & Lifestyle Supplements", child: [] },
      { index: 4, name: "Skin Care Products", child: [] },
      { index: 5, name: "Makeup Products", child: [] },
      { index: 6, name: "Health Care Products", child: [] },
      { index: 7, name: "Medical & Mobility", child: [] },
      { index: 8, name: "Vision Care Products", child: [] },
      { index: 9, name: "Shaving & Hair Removal Products", child: [] },
      { index: 10, name: "Natural & Alternative Remedies", child: [] },
      { index: 11, name: "Bath & Body Products", child: [] },
      { index: 12, name: "Manicure, Pedicure & Nail Care Products", child: [] },
      { index: 13, name: "Oral Care Products", child: [] },
      { index: 14, name: "Massaging Equipment & Supplies", child: [] },
    ],
  },
  {
    name: "Business & Industrial",
    index: 10,
    child: [
      { index: 1, name: "Heavy Equipment, Parts & Attachments", child: [] },
      { index: 2, name: "Healthcare, Lab & Dental", child: [] },
      { index: 3, name: "CNC, Metalworking & Manufacturing", child: [] },
      { index: 4, name: "Restaurant & Food Service", child: [] },
      { index: 5, name: "Industrial Automation & Motion Controls", child: [] },
      { index: 6, name: "Electrical Equipment & Supplies", child: [] },
      { index: 7, name: "Office Equipment & Supplies", child: [] },
      { index: 8, name: "Light Industrial Equipment & Tools", child: [] },
      { index: 9, name: "Test, Measurement & Inspection Equipment", child: [] },
      {
        index: 10,
        name: "Hydraulics, Pneumatics, Pumps & Plumbing",
        child: [],
      },
      { index: 11, name: "Material Handling", child: [] },
      { index: 12, name: "Facility Maintenance & Safety", child: [] },
      { index: 13, name: "Retail & Services", child: [] },
    ],
  },
  {
    name: "Jewelry & Watches",
    index: 11,
    child: [
      { index: 1, name: "Watches, Parts & Accessories", child: [] },
      { index: 2, name: "Fine Jewelry", child: [] },
      { index: 3, name: "Fashion Jewelry", child: [] },
      { index: 4, name: "Vintage & Antique Jewelry", child: [] },
      { index: 5, name: "Men's Jewelry", child: [] },
      { index: 6, name: "Loose Diamonds & Gemstones", child: [] },
      { index: 7, name: "Engagement & Wedding Jewelry", child: [] },
      { index: 8, name: "Ethnic, Regional & Tribal Jewelry", child: [] },
      { index: 9, name: "Jewelry Care, Design & Repair", child: [] },
    ],
  },
  {
    name: "Baby Essentials",
    index: 12,
    child: [
      { index: 1, name: "Baby Clothing, Shoes & Accessories", child: [] },
      { index: 2, name: "Strollers & Accessories", child: [] },
    ],
  },
  {
    name: "Pet Supplies",
    index: 13,
    child: [
      { index: 1, name: "Dog Supplies", child: [] },
      { index: 2, name: "Fish & Aquariums", child: [] },
    ],
  },
];

// Calculate different objects and array that represent the categories
// export const flatCategories: Array<FlatCategory> = [
//   { name: "Motors", index: 1, id: 72057594037927940n },
//   { name: "Auto Parts & Accessories", index: 1, id: 72339069014638600n },
//   { name: "Other Vehicles & Trailers", index: 2, id: 72620543991349250n },
//   { name: "Motorcycles", index: 3, id: 72902018968059900n },
//   { name: "Automotive Tools & Supplies", index: 4, id: 73183493944770560n },
//   { name: "Powersport Vehicles", index: 5, id: 73464968921481220n },
//   { name: "Boats", index: 6, id: 73746443898191870n },
//   { name: "Top Vehicle Makes", index: 7, id: 74027918874902530n },
//   { name: "Electronics", index: 2, id: 144115188075855870n },
//   {
//     name: "Computers, Tablets & Network Hardware",
//     index: 1,
//     id: 144396663052566530n,
//   },
//   {
//     name: "Cell Phones, Smart Watches & Accessories",
//     index: 2,
//     id: 144678138029277200n,
//   },
//   { name: "Video Games & Consoles", index: 3, id: 144959613005987840n },
//   { name: "Cameras & Photo", index: 4, id: 145241087982698500n },
//   {
//     name: "TV, Video & Home Audio Electronics",
//     index: 5,
//     id: 145522562959409150n,
//   },
//   { name: "Vehicle Electronics & GPS", index: 6, id: 145804037936119800n },
//   { name: "Portable Audio & Headphones", index: 7, id: 146085512912830460n },
//   {
//     name: "Major Appliances, Parts & Accessories",
//     index: 8,
//     id: 146366987889541120n,
//   },
//   {
//     name: "Surveillance & Smart Home Electronics",
//     index: 9,
//     id: 146648462866251780n,
//   },
//   { name: "Home Surveillance Systems", index: 10, id: 146929937842962430n },
//   { name: "Collectibles & Art", index: 3, id: 216172782113783800n },
//   { name: "Collectibles", index: 1, id: 216454257090494460n },
//   {
//     name: "Sports Memorabilia, Fan Shop & Sports Cards",
//     index: 2,
//     id: 216735732067205120n,
//   },
//   { name: "Coins & Paper Money", index: 3, id: 217017207043915780n },
//   { name: "Dolls & Teddy Bears", index: 4, id: 217298682020626430n },
//   { name: "Antiques", index: 5, id: 217580156997337100n },
//   { name: "Art & Craft Supplies", index: 6, id: 217861631974047740n },
//   { name: "Art", index: 7, id: 218143106950758400n },
//   { name: "Pottery & Glass", index: 8, id: 218424581927469060n },
//   { name: "Entertainment Memorabilia", index: 9, id: 218706056904179700n },
//   { name: "Vintage & Antique Jewelry", index: 10, id: 218987531880890370n },
//   { name: "Stamps", index: 11, id: 219269006857601020n },
//   { name: "Home & Garden", index: 4, id: 288230376151711740n },
//   { name: "Home Decor", index: 1, id: 288511851128422400n },
//   {
//     name: "Yard, Garden & Outdoor Living Items",
//     index: 2,
//     id: 288793326105133060n,
//   },
//   { name: "Kitchen, Dining & Bar Supplies", index: 3, id: 289074801081843700n },
//   { name: "Tools & Workshop Equipment", index: 4, id: 289356276058554400n },
//   { name: "Home Furniture", index: 5, id: 289637751035265000n },
//   { name: "Home Improvement", index: 6, id: 289919226011975700n },
//   {
//     name: "Major Appliances, Parts & Accessories",
//     index: 7,
//     id: 290200700988686340n,
//   },
//   { name: "Household & Cleaning Supplies", index: 8, id: 290482175965397000n },
//   { name: "Bedding", index: 9, id: 290763650942107650n },
//   {
//     name: "Lamps, Lighting & Ceiling Fans",
//     index: 10,
//     id: 291045125918818300n,
//   },
//   { name: "Food & Beverages", index: 11, id: 291326600895528960n },
//   {
//     name: "Surveillance & Smart Home Electronics",
//     index: 12,
//     id: 291608075872239600n,
//   },
//   { name: "Holiday & Seasonal Decor", index: 13, id: 291889550848950300n },
//   {
//     name: "Bathroom Fixtures, Accessories & Supplies",
//     index: 14,
//     id: 292171025825660900n,
//   },
//   {
//     name: "Greeting Cards & Party Supplies",
//     index: 15,
//     id: 292452500802371600n,
//   },
//   { name: "Candles & Home Fragrance", index: 16, id: 292733975779082240n },
//   { name: "Rugs & Carpets", index: 17, id: 293015450755792900n },
//   { name: "Window Treatments & Hardware", index: 18, id: 293296925732503550n },
//   { name: "Clothing, Shoes & Accessories", index: 5, id: 360287970189639700n },
//   { name: "Action Figures & Accessories", index: 1, id: 360569445166350340n },
//   {
//     name: "Collectible Card Games & Accessories",
//     index: 2,
//     id: 360850920143061000n,
//   },
//   { name: "Video Games", index: 3, id: 361132395119771650n },
//   { name: "Diecast & Toy Vehicles", index: 4, id: 361413870096482300n },
//   { name: "Building Toys", index: 5, id: 361695345073192960n },
//   { name: "Games", index: 6, id: 361976820049903600n },
//   { name: "Model Trains", index: 7, id: 362258295026614300n },
//   {
//     name: "RC Model Vehicles, Toys & Control Line",
//     index: 8,
//     id: 362539770003324900n,
//   },
//   { name: "Toy Models & Kits", index: 9, id: 362821244980035600n },
//   { name: "Preschool Toys & Pretend Play", index: 10, id: 363102719956746240n },
//   { name: "Stuffed Animals", index: 11, id: 363384194933456900n },
//   { name: "Vintage & Antique Toys", index: 12, id: 363665669910167550n },
//   { name: "Outdoor Toys & Structures", index: 13, id: 363947144886878200n },
//   { name: "Beanbag Plushies", index: 14, id: 364228619863588860n },
//   {
//     name: "Electronic, Battery & Wind-Up Toys",
//     index: 15,
//     id: 364510094840299500n,
//   },
//   { name: "Slot Cars", index: 16, id: 364791569817010200n },
//   { name: "Toys & Hobbies", index: 6, id: 432345564227567600n },
//   {
//     name: "Sports Memorabilia, Fan Shop & Sports Cards",
//     index: 1,
//     id: 432627039204278300n,
//   },
//   { name: "Hunting Equipment", index: 2, id: 432908514180988900n },
//   { name: "Golf Equipment", index: 3, id: 433189989157699600n },
//   { name: "Cycling Equipment", index: 4, id: 433471464134410240n },
//   { name: "Outdoor Sports", index: 5, id: 433752939111120900n },
//   { name: "Fishing Equipment & Supplies", index: 6, id: 434034414087831550n },
//   { name: "Team Sports", index: 7, id: 434315889064542200n },
//   { name: "Camping & Hiking Equipment", index: 8, id: 434597364041252860n },
//   {
//     name: "Fitness, Running & Yoga Equipment",
//     index: 9,
//     id: 434878839017963500n,
//   },
//   { name: "Winter Sports", index: 10, id: 435160313994674200n },
//   { name: "Water Sports", index: 11, id: 435441788971384800n },
//   { name: "Indoor Games", index: 12, id: 435723263948095500n },
//   { name: "Tactical & Duty Gear", index: 13, id: 436004738924806140n },
//   { name: "Tennis & Racquet Sports", index: 14, id: 436286213901516800n },
//   { name: "Boxing & MMA Equipment", index: 15, id: 436567688878227460n },
//   { name: "Sporting Goods", index: 7, id: 504403158265495550n },
//   {
//     name: "Sports Memorabilia, Fan Shop & Sports Cards",
//     index: 1,
//     id: 504684633242206200n,
//   },
//   { name: "Hunting Equipment", index: 2, id: 504966108218916860n },
//   { name: "Golf Equipment", index: 3, id: 505247583195627500n },
//   { name: "Cycling Equipment", index: 4, id: 505529058172338200n },
//   { name: "Outdoor Sports", index: 5, id: 505810533149048800n },
//   { name: "Fishing Equipment & Supplies", index: 6, id: 506092008125759500n },
//   { name: "Team Sports", index: 7, id: 506373483102470140n },
//   { name: "Camping & Hiking Equipment", index: 8, id: 506654958079180800n },
//   {
//     name: "Fitness, Running & Yoga Equipment",
//     index: 9,
//     id: 506936433055891460n,
//   },
//   { name: "Winter Sports", index: 10, id: 507217908032602100n },
//   { name: "Water Sports", index: 11, id: 507499383009312800n },
//   { name: "Indoor Games", index: 12, id: 507780857986023400n },
//   { name: "Tactical & Duty Gear", index: 13, id: 508062332962734100n },
//   { name: "Tennis & Racquet Sports", index: 14, id: 508343807939444740n },
//   { name: "Boxing & MMA Equipment", index: 15, id: 508625282916155400n },
//   { name: "Top Brands", index: 16, id: 508906757892866050n },
//   { name: "Popular Topics", index: 17, id: 509188232869576700n },
//   { name: "Top Stores", index: 18, id: 509469707846287360n },
//   { name: "Books, Movies & Music", index: 8, id: 576460752303423500n },
//   { name: "Books & Magazines", index: 1, id: 576742227280134100n },
//   { name: "Musical Instruments & Gear", index: 2, id: 577023702256844800n },
//   { name: "Music", index: 3, id: 577305177233555500n },
//   { name: "Movies & TV", index: 4, id: 577586652210266100n },
//   { name: "Health & Beauty", index: 9, id: 648518346341351400n },
//   { name: "Fragrances", index: 1, id: 648799821318062100n },
//   { name: "Hair Care & Styling Products", index: 2, id: 649081296294772700n },
//   {
//     name: "Vitamins & Lifestyle Supplements",
//     index: 3,
//     id: 649362771271483400n,
//   },
//   { name: "Skin Care Products", index: 4, id: 649644246248194000n },
//   { name: "Makeup Products", index: 5, id: 649925721224904700n },
//   { name: "Health Care Products", index: 6, id: 650207196201615400n },
//   { name: "Medical & Mobility", index: 7, id: 650488671178326000n },
//   { name: "Vision Care Products", index: 8, id: 650770146155036700n },
//   {
//     name: "Shaving & Hair Removal Products",
//     index: 9,
//     id: 651051621131747300n,
//   },
//   {
//     name: "Natural & Alternative Remedies",
//     index: 10,
//     id: 651333096108458000n,
//   },
//   { name: "Bath & Body Products", index: 11, id: 651614571085168600n },
//   {
//     name: "Manicure, Pedicure & Nail Care Products",
//     index: 12,
//     id: 651896046061879300n,
//   },
//   { name: "Oral Care Products", index: 13, id: 652177521038590000n },
//   {
//     name: "Massaging Equipment & Supplies",
//     index: 14,
//     id: 652458996015300600n,
//   },
//   { name: "Business & Industrial", index: 10, id: 720575940379279400n },
//   {
//     name: "Heavy Equipment, Parts & Attachments",
//     index: 1,
//     id: 720857415355990000n,
//   },
//   { name: "Healthcare, Lab & Dental", index: 2, id: 721138890332700700n },
//   {
//     name: "CNC, Metalworking & Manufacturing",
//     index: 3,
//     id: 721420365309411300n,
//   },
//   { name: "Restaurant & Food Service", index: 4, id: 721701840286122000n },
//   {
//     name: "Industrial Automation & Motion Controls",
//     index: 5,
//     id: 721983315262832600n,
//   },
//   {
//     name: "Electrical Equipment & Supplies",
//     index: 6,
//     id: 722264790239543300n,
//   },
//   { name: "Office Equipment & Supplies", index: 7, id: 722546265216254000n },
//   {
//     name: "Light Industrial Equipment & Tools",
//     index: 8,
//     id: 722827740192964600n,
//   },
//   {
//     name: "Test, Measurement & Inspection Equipment",
//     index: 9,
//     id: 723109215169675300n,
//   },
//   {
//     name: "Hydraulics, Pneumatics, Pumps & Plumbing",
//     index: 10,
//     id: 723390690146385900n,
//   },
//   { name: "Material Handling", index: 11, id: 723672165123096600n },
//   { name: "Facility Maintenance & Safety", index: 12, id: 723953640099807200n },
//   { name: "Retail & Services", index: 13, id: 724235115076517900n },
//   { name: "Jewelry & Watches", index: 11, id: 792633534417207300n },
//   { name: "Watches, Parts & Accessories", index: 1, id: 792915009393918000n },
//   { name: "Fine Jewelry", index: 2, id: 793196484370628600n },
//   { name: "Fashion Jewelry", index: 3, id: 793477959347339300n },
//   { name: "Vintage & Antique Jewelry", index: 4, id: 793759434324049900n },
//   { name: "Men's Jewelry", index: 5, id: 794040909300760600n },
//   { name: "Loose Diamonds & Gemstones", index: 6, id: 794322384277471200n },
//   { name: "Engagement & Wedding Jewelry", index: 7, id: 794603859254181900n },
//   {
//     name: "Ethnic, Regional & Tribal Jewelry",
//     index: 8,
//     id: 794885334230892500n,
//   },
//   { name: "Jewelry Care, Design & Repair", index: 9, id: 795166809207603200n },
//   { name: "Baby Essentials", index: 12, id: 864691128455135200n },
//   {
//     name: "Baby Clothing, Shoes & Accessories",
//     index: 1,
//     id: 864972603431845900n,
//   },
//   { name: "Strollers & Accessories", index: 2, id: 865254078408556500n },
//   { name: "Pet Supplies", index: 13, id: 936748722493063200n },
//   { name: "Dog Supplies", index: 1, id: 937030197469773800n },
//   { name: "Fish & Aquariums", index: 2, id: 937311672446484500n },
// ];

// Convert categories to flat categories into the console
// export interface FlatCategory {
//   name: string;
//   index: number;
//   id: bigint;
// }
// function flattenCategories(
//   categories: Category[],
//   byteIndex = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
//   level = 0
// ): FlatCategory[] {
//   let flat: Array<FlatCategory> = [];
//   for (let category of categories) {
//     byteIndex[level] = category.index;
//     for (let i = level + 1; i < byteIndex.length; i++) {
//       byteIndex[i] = 0;
//     }

//     flat.push({
//       name: category.name,
//       index: category.index,
//       id: new DataView(byteIndex.buffer).getBigUint64(0),
//     });
//     if (category.child) {
//       flat = flat.concat(
//         flattenCategories(category.child, byteIndex, level + 1)
//       );
//     }
//   }
//   return flat;
// }
// export const flatCategories = flattenCategories(categories);
// console.log("Flat categories........................", flatCategories);
// console.log(
//   "const c : Array<{ name: string, index: number, id: bigint}> =",
//   JSON.stringify(
//     flatCategories.map((c) => {
//       return { ...c, id: Number(c.id) };
//     })
//   )
//     .replaceAll("},", "n},")
//     .replace("}]", "n}]")
// );
// export let categoryPathsById: { [id: string]: string } = {};
// for (let category of flatCategories) {
//   categoryPathsById[category.id.toString()] = getCategoryPath(category.id);
// }
// console.log(
//   "const categoryPathsById: { [id: string]: string } =",
//   categoryPathsById
// );

export const categoryPathsById: { [key: string]: string } = {
  "72057594037927936": "Motors",
  "72339069014638592": "Motors / Auto Parts & Accessories",
  "72620543991349248": "Motors / Other Vehicles & Trailers",
  "72902018968059904": "Motors / Motorcycles",
  "73183493944770560": "Motors / Automotive Tools & Supplies",
  "73464968921481216": "Motors / Powersport Vehicles",
  "73746443898191872": "Motors / Boats",
  "74027918874902528": "Motors / Top Vehicle Makes",
  "144115188075855872": "Electronics",
  "144396663052566528": "Electronics / Computers, Tablets & Network Hardware",
  "144678138029277184":
    "Electronics / Cell Phones, Smart Watches & Accessories",
  "144959613005987840": "Electronics / Video Games & Consoles",
  "145241087982698496": "Electronics / Cameras & Photo",
  "145522562959409152": "Electronics / TV, Video & Home Audio Electronics",
  "145804037936119808": "Electronics / Vehicle Electronics & GPS",
  "146085512912830464": "Electronics / Portable Audio & Headphones",
  "146366987889541120": "Electronics / Major Appliances, Parts & Accessories",
  "146648462866251776": "Electronics / Surveillance & Smart Home Electronics",
  "146929937842962432": "Electronics / Home Surveillance Systems",
  "216172782113783808": "Collectibles & Art",
  "216454257090494464": "Collectibles & Art / Collectibles",
  "216735732067205120":
    "Collectibles & Art / Sports Memorabilia, Fan Shop & Sports Cards",
  "217017207043915776": "Collectibles & Art / Coins & Paper Money",
  "217298682020626432": "Collectibles & Art / Dolls & Teddy Bears",
  "217580156997337088": "Collectibles & Art / Antiques",
  "217861631974047744": "Collectibles & Art / Art & Craft Supplies",
  "218143106950758400": "Collectibles & Art / Art",
  "218424581927469056": "Collectibles & Art / Pottery & Glass",
  "218706056904179712": "Collectibles & Art / Entertainment Memorabilia",
  "218987531880890368": "Collectibles & Art / Vintage & Antique Jewelry",
  "219269006857601024": "Collectibles & Art / Stamps",
  "288230376151711744": "Home & Garden",
  "288511851128422400": "Home & Garden / Home Decor",
  "288793326105133056": "Home & Garden / Yard, Garden & Outdoor Living Items",
  "289074801081843712": "Home & Garden / Kitchen, Dining & Bar Supplies",
  "289356276058554368": "Home & Garden / Tools & Workshop Equipment",
  "289637751035265024": "Home & Garden / Home Furniture",
  "289919226011975680": "Home & Garden / Home Improvement",
  "290200700988686336": "Home & Garden / Major Appliances, Parts & Accessories",
  "290482175965396992": "Home & Garden / Household & Cleaning Supplies",
  "290763650942107648": "Home & Garden / Bedding",
  "291045125918818304": "Home & Garden / Lamps, Lighting & Ceiling Fans",
  "291326600895528960": "Home & Garden / Food & Beverages",
  "291608075872239616": "Home & Garden / Surveillance & Smart Home Electronics",
  "291889550848950272": "Home & Garden / Holiday & Seasonal Decor",
  "292171025825660928":
    "Home & Garden / Bathroom Fixtures, Accessories & Supplies",
  "292452500802371584": "Home & Garden / Greeting Cards & Party Supplies",
  "292733975779082240": "Home & Garden / Candles & Home Fragrance",
  "293015450755792896": "Home & Garden / Rugs & Carpets",
  "293296925732503552": "Home & Garden / Window Treatments & Hardware",
  "360287970189639680": "Clothing, Shoes & Accessories",
  "360569445166350336":
    "Clothing, Shoes & Accessories / Action Figures & Accessories",
  "360850920143060992":
    "Clothing, Shoes & Accessories / Collectible Card Games & Accessories",
  "361132395119771648": "Clothing, Shoes & Accessories / Video Games",
  "361413870096482304":
    "Clothing, Shoes & Accessories / Diecast & Toy Vehicles",
  "361695345073192960": "Clothing, Shoes & Accessories / Building Toys",
  "361976820049903616": "Clothing, Shoes & Accessories / Games",
  "362258295026614272": "Clothing, Shoes & Accessories / Model Trains",
  "362539770003324928":
    "Clothing, Shoes & Accessories / RC Model Vehicles, Toys & Control Line",
  "362821244980035584": "Clothing, Shoes & Accessories / Toy Models & Kits",
  "363102719956746240":
    "Clothing, Shoes & Accessories / Preschool Toys & Pretend Play",
  "363384194933456896": "Clothing, Shoes & Accessories / Stuffed Animals",
  "363665669910167552":
    "Clothing, Shoes & Accessories / Vintage & Antique Toys",
  "363947144886878208":
    "Clothing, Shoes & Accessories / Outdoor Toys & Structures",
  "364228619863588864": "Clothing, Shoes & Accessories / Beanbag Plushies",
  "364510094840299520":
    "Clothing, Shoes & Accessories / Electronic, Battery & Wind-Up Toys",
  "364791569817010176": "Clothing, Shoes & Accessories / Slot Cars",
  "432345564227567616": "Toys & Hobbies",
  "432627039204278272":
    "Toys & Hobbies / Sports Memorabilia, Fan Shop & Sports Cards",
  "432908514180988928": "Toys & Hobbies / Hunting Equipment",
  "433189989157699584": "Toys & Hobbies / Golf Equipment",
  "433471464134410240": "Toys & Hobbies / Cycling Equipment",
  "433752939111120896": "Toys & Hobbies / Outdoor Sports",
  "434034414087831552": "Toys & Hobbies / Fishing Equipment & Supplies",
  "434315889064542208": "Toys & Hobbies / Team Sports",
  "434597364041252864": "Toys & Hobbies / Camping & Hiking Equipment",
  "434878839017963520": "Toys & Hobbies / Fitness, Running & Yoga Equipment",
  "435160313994674176": "Toys & Hobbies / Winter Sports",
  "435441788971384832": "Toys & Hobbies / Water Sports",
  "435723263948095488": "Toys & Hobbies / Indoor Games",
  "436004738924806144": "Toys & Hobbies / Tactical & Duty Gear",
  "436286213901516800": "Toys & Hobbies / Tennis & Racquet Sports",
  "436567688878227456": "Toys & Hobbies / Boxing & MMA Equipment",
  "504403158265495552": "Sporting Goods",
  "504684633242206208":
    "Sporting Goods / Sports Memorabilia, Fan Shop & Sports Cards",
  "504966108218916864": "Sporting Goods / Hunting Equipment",
  "505247583195627520": "Sporting Goods / Golf Equipment",
  "505529058172338176": "Sporting Goods / Cycling Equipment",
  "505810533149048832": "Sporting Goods / Outdoor Sports",
  "506092008125759488": "Sporting Goods / Fishing Equipment & Supplies",
  "506373483102470144": "Sporting Goods / Team Sports",
  "506654958079180800": "Sporting Goods / Camping & Hiking Equipment",
  "506936433055891456": "Sporting Goods / Fitness, Running & Yoga Equipment",
  "507217908032602112": "Sporting Goods / Winter Sports",
  "507499383009312768": "Sporting Goods / Water Sports",
  "507780857986023424": "Sporting Goods / Indoor Games",
  "508062332962734080": "Sporting Goods / Tactical & Duty Gear",
  "508343807939444736": "Sporting Goods / Tennis & Racquet Sports",
  "508625282916155392": "Sporting Goods / Boxing & MMA Equipment",
  "508906757892866048": "Sporting Goods / Top Brands",
  "509188232869576704": "Sporting Goods / Popular Topics",
  "509469707846287360": "Sporting Goods / Top Stores",
  "576460752303423488": "Books, Movies & Music",
  "576742227280134144": "Books, Movies & Music / Books & Magazines",
  "577023702256844800": "Books, Movies & Music / Musical Instruments & Gear",
  "577305177233555456": "Books, Movies & Music / Music",
  "577586652210266112": "Books, Movies & Music / Movies & TV",
  "648518346341351424": "Health & Beauty",
  "648799821318062080": "Health & Beauty / Fragrances",
  "649081296294772736": "Health & Beauty / Hair Care & Styling Products",
  "649362771271483392": "Health & Beauty / Vitamins & Lifestyle Supplements",
  "649644246248194048": "Health & Beauty / Skin Care Products",
  "649925721224904704": "Health & Beauty / Makeup Products",
  "650207196201615360": "Health & Beauty / Health Care Products",
  "650488671178326016": "Health & Beauty / Medical & Mobility",
  "650770146155036672": "Health & Beauty / Vision Care Products",
  "651051621131747328": "Health & Beauty / Shaving & Hair Removal Products",
  "651333096108457984": "Health & Beauty / Natural & Alternative Remedies",
  "651614571085168640": "Health & Beauty / Bath & Body Products",
  "651896046061879296":
    "Health & Beauty / Manicure, Pedicure & Nail Care Products",
  "652177521038589952": "Health & Beauty / Oral Care Products",
  "652458996015300608": "Health & Beauty / Massaging Equipment & Supplies",
  "720575940379279360": "Business & Industrial",
  "720857415355990016":
    "Business & Industrial / Heavy Equipment, Parts & Attachments",
  "721138890332700672": "Business & Industrial / Healthcare, Lab & Dental",
  "721420365309411328":
    "Business & Industrial / CNC, Metalworking & Manufacturing",
  "721701840286121984": "Business & Industrial / Restaurant & Food Service",
  "721983315262832640":
    "Business & Industrial / Industrial Automation & Motion Controls",
  "722264790239543296":
    "Business & Industrial / Electrical Equipment & Supplies",
  "722546265216253952": "Business & Industrial / Office Equipment & Supplies",
  "722827740192964608":
    "Business & Industrial / Light Industrial Equipment & Tools",
  "723109215169675264":
    "Business & Industrial / Test, Measurement & Inspection Equipment",
  "723390690146385920":
    "Business & Industrial / Hydraulics, Pneumatics, Pumps & Plumbing",
  "723672165123096576": "Business & Industrial / Material Handling",
  "723953640099807232": "Business & Industrial / Facility Maintenance & Safety",
  "724235115076517888": "Business & Industrial / Retail & Services",
  "792633534417207296": "Jewelry & Watches",
  "792915009393917952": "Jewelry & Watches / Watches, Parts & Accessories",
  "793196484370628608": "Jewelry & Watches / Fine Jewelry",
  "793477959347339264": "Jewelry & Watches / Fashion Jewelry",
  "793759434324049920": "Jewelry & Watches / Vintage & Antique Jewelry",
  "794040909300760576": "Jewelry & Watches / Men's Jewelry",
  "794322384277471232": "Jewelry & Watches / Loose Diamonds & Gemstones",
  "794603859254181888": "Jewelry & Watches / Engagement & Wedding Jewelry",
  "794885334230892544": "Jewelry & Watches / Ethnic, Regional & Tribal Jewelry",
  "795166809207603200": "Jewelry & Watches / Jewelry Care, Design & Repair",
  "864691128455135232": "Baby Essentials",
  "864972603431845888": "Baby Essentials / Baby Clothing, Shoes & Accessories",
  "865254078408556544": "Baby Essentials / Strollers & Accessories",
  "936748722493063168": "Pet Supplies",
  "937030197469773824": "Pet Supplies / Dog Supplies",
  "937311672446484480": "Pet Supplies / Fish & Aquariums",
};

export function categoryBigInt(main: number, sub1: number) {
  let byteArray = new Uint8Array([main, sub1, 0, 0, 0, 0, 0, 0]);
  let dataView = new DataView(byteArray.buffer);
  return dataView.getBigUint64(0);
}

export function categoryHex(main: number, sub1: number) {
  return "0x" + categoryBigInt(main, sub1).toString(16).padStart(16, "0");
}

export function indexesById(id: bigint) {
  let byteArray = new Uint8Array(8);
  let dataView = new DataView(byteArray.buffer);
  dataView.setBigUint64(0, id);
  return Array.from(byteArray);
}

function getCategoryPathByIndexes(
  byteIndexes: Array<number>,
  level: number = 0,
  cat: Category = categories[byteIndexes[0] - 1]
): string {
  if (cat === undefined) {
    return "";
  }
  if (
    cat.child === undefined ||
    cat.child.length === 0 ||
    byteIndexes.length === level + 1 ||
    byteIndexes[level + 1] === 0
  ) {
    return cat.name;
  }
  const subCat = cat.child[byteIndexes[level + 1] - 1];
  return (
    cat.name + " / " + getCategoryPathByIndexes(byteIndexes, level + 1, subCat)
  );
}

export function getCategoryPath(id: bigint) {
  return getCategoryPathByIndexes(indexesById(id));
}
