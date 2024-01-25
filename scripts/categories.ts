export interface Category {
  name: string;
  index: number;
  child?: Category[];
}

// Note: Start counting by one to prevent confusion with account names on API requests, because 0x0100000000000000 = 72057594037927936 is as string longer than any account name
export const categories: Array<Category> = [
  {
    name: 'Motors',
    index: 1,
    child: [
      { index: 1, name: 'Auto Parts & Accessories', child: [] },
      { index: 2, name: 'Other Vehicles & Trailers', child: [] },
      { index: 3, name: 'Motorcycles', child: [] },
      { index: 4, name: 'Automotive Tools & Supplies', child: [] },
      { index: 5, name: 'Powersport Vehicles', child: [] },
      { index: 6, name: 'Boats', child: [] },
      { index: 7, name: 'Top Vehicle Makes', child: [] },
    ],
  },
  {
    name: 'Electronics',
    index: 2,
    child: [
      { index: 1, name: 'Computers, Tablets & Network Hardware', child: [] },
      { index: 2, name: 'Cell Phones, Smart Watches & Accessories', child: [] },
      { index: 3, name: 'Video Games & Consoles', child: [] },
      { index: 4, name: 'Cameras & Photo', child: [] },
      { index: 5, name: 'TV, Video & Home Audio Electronics', child: [] },
      { index: 6, name: 'Vehicle Electronics & GPS', child: [] },
      { index: 7, name: 'Portable Audio & Headphones', child: [] },
      { index: 8, name: 'Major Appliances, Parts & Accessories', child: [] },
      { index: 9, name: 'Surveillance & Smart Home Electronics', child: [] },
      { index: 10, name: 'Home Surveillance Systems', child: [] },
    ],
  },
  {
    name: 'Collectibles & Art',
    index: 3,
    child: [
      { index: 1, name: 'Collectibles', child: [] },
      {
        index: 2,
        name: 'Sports Memorabilia, Fan Shop & Sports Cards',
        child: [],
      },
      { index: 3, name: 'Coins & Paper Money', child: [] },
      { index: 4, name: 'Dolls & Teddy Bears', child: [] },
      { index: 5, name: 'Antiques', child: [] },
      { index: 6, name: 'Art & Craft Supplies', child: [] },
      { index: 7, name: 'Art', child: [] },
      { index: 8, name: 'Pottery & Glass', child: [] },
      { index: 9, name: 'Entertainment Memorabilia', child: [] },
      { index: 10, name: 'Vintage & Antique Jewelry', child: [] },
      { index: 11, name: 'Stamps', child: [] },
    ],
  },
  {
    name: 'Home & Garden',
    index: 4,
    child: [
      { index: 1, name: 'Home Décor', child: [] },
      { index: 2, name: 'Yard, Garden & Outdoor Living Items', child: [] },
      { index: 3, name: 'Kitchen, Dining & Bar Supplies', child: [] },
      { index: 4, name: 'Tools & Workshop Equipment', child: [] },
      { index: 5, name: 'Home Furniture', child: [] },
      { index: 6, name: 'Home Improvement', child: [] },
      { index: 7, name: 'Major Appliances, Parts & Accessories', child: [] },
      { index: 8, name: 'Household & Cleaning Supplies', child: [] },
      { index: 9, name: 'Bedding', child: [] },
      { index: 10, name: 'Lamps, Lighting & Ceiling Fans', child: [] },
      { index: 11, name: 'Food & Beverages', child: [] },
      { index: 12, name: 'Surveillance & Smart Home Electronics', child: [] },
      { index: 13, name: 'Holiday & Seasonal Décor', child: [] },
      {
        index: 14,
        name: 'Bathroom Fixtures, Accessories & Supplies',
        child: [],
      },
      { index: 15, name: 'Greeting Cards & Party Supplies', child: [] },
      { index: 16, name: 'Candles & Home Fragrance', child: [] },
      { index: 17, name: 'Rugs & Carpets', child: [] },
      { index: 18, name: 'Window Treatments & Hardware', child: [] },
    ],
  },
  {
    name: 'Clothing, Shoes & Accessories',
    index: 5,
    child: [
      { index: 1, name: 'Action Figures & Accessories', child: [] },
      { index: 2, name: 'Collectible Card Games & Accessories', child: [] },
      { index: 3, name: 'Video Games', child: [] },
      { index: 4, name: 'Diecast & Toy Vehicles', child: [] },
      { index: 5, name: 'Building Toys', child: [] },
      { index: 6, name: 'Games', child: [] },
      { index: 7, name: 'Model Trains', child: [] },
      { index: 8, name: 'RC Model Vehicles, Toys & Control Line', child: [] },
      { index: 9, name: 'Toy Models & Kits', child: [] },
      { index: 10, name: 'Preschool Toys & Pretend Play', child: [] },
      { index: 11, name: 'Stuffed Animals', child: [] },
      { index: 12, name: 'Vintage & Antique Toys', child: [] },
      { index: 13, name: 'Outdoor Toys & Structures', child: [] },
      { index: 14, name: 'Beanbag Plushies', child: [] },
      { index: 15, name: 'Electronic, Battery & Wind-Up Toys', child: [] },
      { index: 16, name: 'Slot Cars', child: [] },
    ],
  },
  {
    name: 'Toys & Hobbies',
    index: 6,
    child: [
      {
        index: 1,
        name: 'Sports Memorabilia, Fan Shop & Sports Cards',
        child: [],
      },
      { index: 2, name: 'Hunting Equipment', child: [] },
      { index: 3, name: 'Golf Equipment', child: [] },
      { index: 4, name: 'Cycling Equipment', child: [] },
      { index: 5, name: 'Outdoor Sports', child: [] },
      { index: 6, name: 'Fishing Equipment & Supplies', child: [] },
      { index: 7, name: 'Team Sports', child: [] },
      { index: 8, name: 'Camping & Hiking Equipment', child: [] },
      { index: 9, name: 'Fitness, Running & Yoga Equipment', child: [] },
      { index: 10, name: 'Winter Sports', child: [] },
      { index: 11, name: 'Water Sports', child: [] },
      { index: 12, name: 'Indoor Games', child: [] },
      { index: 13, name: 'Tactical & Duty Gear', child: [] },
      { index: 14, name: 'Tennis & Racquet Sports', child: [] },
      { index: 15, name: 'Boxing & MMA Equipment', child: [] },
    ],
  },
  {
    name: 'Sporting Goods',
    index: 7,
    child: [
      {
        index: 1,
        name: 'Sports Memorabilia, Fan Shop & Sports Cards',
        child: [],
      },
      { index: 2, name: 'Hunting Equipment', child: [] },
      { index: 3, name: 'Golf Equipment', child: [] },
      { index: 4, name: 'Cycling Equipment', child: [] },
      { index: 5, name: 'Outdoor Sports', child: [] },
      { index: 6, name: 'Fishing Equipment & Supplies', child: [] },
      { index: 7, name: 'Team Sports', child: [] },
      { index: 8, name: 'Camping & Hiking Equipment', child: [] },
      { index: 9, name: 'Fitness, Running & Yoga Equipment', child: [] },
      { index: 10, name: 'Winter Sports', child: [] },
      { index: 11, name: 'Water Sports', child: [] },
      { index: 12, name: 'Indoor Games', child: [] },
      { index: 13, name: 'Tactical & Duty Gear', child: [] },
      { index: 14, name: 'Tennis & Racquet Sports', child: [] },
      { index: 15, name: 'Boxing & MMA Equipment', child: [] },
      { index: 16, name: 'Top Brands', child: [] },
      { index: 17, name: 'Popular Topics', child: [] },
      { index: 18, name: 'Top Stores', child: [] },
    ],
  },
  {
    name: 'Books, Movies & Music',
    index: 8,
    child: [
      { index: 1, name: 'Books & Magazines', child: [] },
      { index: 2, name: 'Musical Instruments & Gear', child: [] },
      { index: 3, name: 'Music', child: [] },
      { index: 4, name: 'Movies & TV', child: [] },
    ],
  },
  {
    name: 'Health & Beauty',
    index: 9,
    child: [
      { index: 1, name: 'Fragrances', child: [] },
      { index: 2, name: 'Hair Care & Styling Products', child: [] },
      { index: 3, name: 'Vitamins & Lifestyle Supplements', child: [] },
      { index: 4, name: 'Skin Care Products', child: [] },
      { index: 5, name: 'Makeup Products', child: [] },
      { index: 6, name: 'Health Care Products', child: [] },
      { index: 7, name: 'Medical & Mobility', child: [] },
      { index: 8, name: 'Vision Care Products', child: [] },
      { index: 9, name: 'Shaving & Hair Removal Products', child: [] },
      { index: 10, name: 'Natural & Alternative Remedies', child: [] },
      { index: 11, name: 'Bath & Body Products', child: [] },
      { index: 12, name: 'Manicure, Pedicure & Nail Care Products', child: [] },
      { index: 13, name: 'Oral Care Products', child: [] },
      { index: 14, name: 'Massaging Equipment & Supplies', child: [] },
    ],
  },
  {
    name: 'Business & Industrial',
    index: 10,
    child: [
      { index: 1, name: 'Heavy Equipment, Parts & Attachments', child: [] },
      { index: 2, name: 'Healthcare, Lab & Dental', child: [] },
      { index: 3, name: 'CNC, Metalworking & Manufacturing', child: [] },
      { index: 4, name: 'Restaurant & Food Service', child: [] },
      { index: 5, name: 'Industrial Automation & Motion Controls', child: [] },
      { index: 6, name: 'Electrical Equipment & Supplies', child: [] },
      { index: 7, name: 'Office Equipment & Supplies', child: [] },
      { index: 8, name: 'Light Industrial Equipment & Tools', child: [] },
      { index: 9, name: 'Test, Measurement & Inspection Equipment', child: [] },
      {
        index: 10,
        name: 'Hydraulics, Pneumatics, Pumps & Plumbing',
        child: [],
      },
      { index: 11, name: 'Material Handling', child: [] },
      { index: 12, name: 'Facility Maintenance & Safety', child: [] },
      { index: 13, name: 'Retail & Services', child: [] },
    ],
  },
  {
    name: 'Jewelry & Watches',
    index: 11,
    child: [
      { index: 1, name: 'Watches, Parts & Accessories', child: [] },
      { index: 2, name: 'Fine Jewelry', child: [] },
      { index: 3, name: 'Fashion Jewelry', child: [] },
      { index: 4, name: 'Vintage & Antique Jewelry', child: [] },
      { index: 5, name: "Men's Jewelry", child: [] },
      { index: 6, name: 'Loose Diamonds & Gemstones', child: [] },
      { index: 7, name: 'Engagement & Wedding Jewelry', child: [] },
      { index: 8, name: 'Ethnic, Regional & Tribal Jewelry', child: [] },
      { index: 9, name: 'Jewelry Care, Design & Repair', child: [] },
    ],
  },
  {
    name: 'Baby Essentials',
    index: 12,
    child: [
      { index: 1, name: 'Baby Clothing, Shoes & Accessories', child: [] },
      { index: 2, name: 'Strollers & Accessories', child: [] },
    ],
  },
  {
    name: 'Pet Supplies',
    index: 13,
    child: [
      { index: 1, name: 'Dog Supplies', child: [] },
      { index: 2, name: 'Fish & Aquariums', child: [] },
    ],
  },
];

export const categoryPathsById: { [key: string]: string } = {
  '72057594037927936': 'Motors',
  '72339069014638592': 'Motors / Auto Parts & Accessories',
  '72620543991349248': 'Motors / Other Vehicles & Trailers',
  '72902018968059904': 'Motors / Motorcycles',
  '73183493944770560': 'Motors / Automotive Tools & Supplies',
  '73464968921481216': 'Motors / Powersport Vehicles',
  '73746443898191872': 'Motors / Boats',
  '74027918874902528': 'Motors / Top Vehicle Makes',
  '144115188075855872': 'Electronics',
  '144396663052566528': 'Electronics / Computers, Tablets & Network Hardware',
  '144678138029277184':
    'Electronics / Cell Phones, Smart Watches & Accessories',
  '144959613005987840': 'Electronics / Video Games & Consoles',
  '145241087982698496': 'Electronics / Cameras & Photo',
  '145522562959409152': 'Electronics / TV, Video & Home Audio Electronics',
  '145804037936119808': 'Electronics / Vehicle Electronics & GPS',
  '146085512912830464': 'Electronics / Portable Audio & Headphones',
  '146366987889541120': 'Electronics / Major Appliances, Parts & Accessories',
  '146648462866251776': 'Electronics / Surveillance & Smart Home Electronics',
  '146929937842962432': 'Electronics / Home Surveillance Systems',
  '216172782113783808': 'Collectibles & Art',
  '216454257090494464': 'Collectibles & Art / Collectibles',
  '216735732067205120':
    'Collectibles & Art / Sports Memorabilia, Fan Shop & Sports Cards',
  '217017207043915776': 'Collectibles & Art / Coins & Paper Money',
  '217298682020626432': 'Collectibles & Art / Dolls & Teddy Bears',
  '217580156997337088': 'Collectibles & Art / Antiques',
  '217861631974047744': 'Collectibles & Art / Art & Craft Supplies',
  '218143106950758400': 'Collectibles & Art / Art',
  '218424581927469056': 'Collectibles & Art / Pottery & Glass',
  '218706056904179712': 'Collectibles & Art / Entertainment Memorabilia',
  '218987531880890368': 'Collectibles & Art / Vintage & Antique Jewelry',
  '219269006857601024': 'Collectibles & Art / Stamps',
  '288230376151711744': 'Home & Garden',
  '288511851128422400': 'Home & Garden / Home Decor',
  '288793326105133056': 'Home & Garden / Yard, Garden & Outdoor Living Items',
  '289074801081843712': 'Home & Garden / Kitchen, Dining & Bar Supplies',
  '289356276058554368': 'Home & Garden / Tools & Workshop Equipment',
  '289637751035265024': 'Home & Garden / Home Furniture',
  '289919226011975680': 'Home & Garden / Home Improvement',
  '290200700988686336': 'Home & Garden / Major Appliances, Parts & Accessories',
  '290482175965396992': 'Home & Garden / Household & Cleaning Supplies',
  '290763650942107648': 'Home & Garden / Bedding',
  '291045125918818304': 'Home & Garden / Lamps, Lighting & Ceiling Fans',
  '291326600895528960': 'Home & Garden / Food & Beverages',
  '291608075872239616': 'Home & Garden / Surveillance & Smart Home Electronics',
  '291889550848950272': 'Home & Garden / Holiday & Seasonal Decor',
  '292171025825660928':
    'Home & Garden / Bathroom Fixtures, Accessories & Supplies',
  '292452500802371584': 'Home & Garden / Greeting Cards & Party Supplies',
  '292733975779082240': 'Home & Garden / Candles & Home Fragrance',
  '293015450755792896': 'Home & Garden / Rugs & Carpets',
  '293296925732503552': 'Home & Garden / Window Treatments & Hardware',
  '360287970189639680': 'Clothing, Shoes & Accessories',
  '360569445166350336':
    'Clothing, Shoes & Accessories / Action Figures & Accessories',
  '360850920143060992':
    'Clothing, Shoes & Accessories / Collectible Card Games & Accessories',
  '361132395119771648': 'Clothing, Shoes & Accessories / Video Games',
  '361413870096482304':
    'Clothing, Shoes & Accessories / Diecast & Toy Vehicles',
  '361695345073192960': 'Clothing, Shoes & Accessories / Building Toys',
  '361976820049903616': 'Clothing, Shoes & Accessories / Games',
  '362258295026614272': 'Clothing, Shoes & Accessories / Model Trains',
  '362539770003324928':
    'Clothing, Shoes & Accessories / RC Model Vehicles, Toys & Control Line',
  '362821244980035584': 'Clothing, Shoes & Accessories / Toy Models & Kits',
  '363102719956746240':
    'Clothing, Shoes & Accessories / Preschool Toys & Pretend Play',
  '363384194933456896': 'Clothing, Shoes & Accessories / Stuffed Animals',
  '363665669910167552':
    'Clothing, Shoes & Accessories / Vintage & Antique Toys',
  '363947144886878208':
    'Clothing, Shoes & Accessories / Outdoor Toys & Structures',
  '364228619863588864': 'Clothing, Shoes & Accessories / Beanbag Plushies',
  '364510094840299520':
    'Clothing, Shoes & Accessories / Electronic, Battery & Wind-Up Toys',
  '364791569817010176': 'Clothing, Shoes & Accessories / Slot Cars',
  '432345564227567616': 'Toys & Hobbies',
  '432627039204278272':
    'Toys & Hobbies / Sports Memorabilia, Fan Shop & Sports Cards',
  '432908514180988928': 'Toys & Hobbies / Hunting Equipment',
  '433189989157699584': 'Toys & Hobbies / Golf Equipment',
  '433471464134410240': 'Toys & Hobbies / Cycling Equipment',
  '433752939111120896': 'Toys & Hobbies / Outdoor Sports',
  '434034414087831552': 'Toys & Hobbies / Fishing Equipment & Supplies',
  '434315889064542208': 'Toys & Hobbies / Team Sports',
  '434597364041252864': 'Toys & Hobbies / Camping & Hiking Equipment',
  '434878839017963520': 'Toys & Hobbies / Fitness, Running & Yoga Equipment',
  '435160313994674176': 'Toys & Hobbies / Winter Sports',
  '435441788971384832': 'Toys & Hobbies / Water Sports',
  '435723263948095488': 'Toys & Hobbies / Indoor Games',
  '436004738924806144': 'Toys & Hobbies / Tactical & Duty Gear',
  '436286213901516800': 'Toys & Hobbies / Tennis & Racquet Sports',
  '436567688878227456': 'Toys & Hobbies / Boxing & MMA Equipment',
  '504403158265495552': 'Sporting Goods',
  '504684633242206208':
    'Sporting Goods / Sports Memorabilia, Fan Shop & Sports Cards',
  '504966108218916864': 'Sporting Goods / Hunting Equipment',
  '505247583195627520': 'Sporting Goods / Golf Equipment',
  '505529058172338176': 'Sporting Goods / Cycling Equipment',
  '505810533149048832': 'Sporting Goods / Outdoor Sports',
  '506092008125759488': 'Sporting Goods / Fishing Equipment & Supplies',
  '506373483102470144': 'Sporting Goods / Team Sports',
  '506654958079180800': 'Sporting Goods / Camping & Hiking Equipment',
  '506936433055891456': 'Sporting Goods / Fitness, Running & Yoga Equipment',
  '507217908032602112': 'Sporting Goods / Winter Sports',
  '507499383009312768': 'Sporting Goods / Water Sports',
  '507780857986023424': 'Sporting Goods / Indoor Games',
  '508062332962734080': 'Sporting Goods / Tactical & Duty Gear',
  '508343807939444736': 'Sporting Goods / Tennis & Racquet Sports',
  '508625282916155392': 'Sporting Goods / Boxing & MMA Equipment',
  '508906757892866048': 'Sporting Goods / Top Brands',
  '509188232869576704': 'Sporting Goods / Popular Topics',
  '509469707846287360': 'Sporting Goods / Top Stores',
  '576460752303423488': 'Books, Movies & Music',
  '576742227280134144': 'Books, Movies & Music / Books & Magazines',
  '577023702256844800': 'Books, Movies & Music / Musical Instruments & Gear',
  '577305177233555456': 'Books, Movies & Music / Music',
  '577586652210266112': 'Books, Movies & Music / Movies & TV',
  '648518346341351424': 'Health & Beauty',
  '648799821318062080': 'Health & Beauty / Fragrances',
  '649081296294772736': 'Health & Beauty / Hair Care & Styling Products',
  '649362771271483392': 'Health & Beauty / Vitamins & Lifestyle Supplements',
  '649644246248194048': 'Health & Beauty / Skin Care Products',
  '649925721224904704': 'Health & Beauty / Makeup Products',
  '650207196201615360': 'Health & Beauty / Health Care Products',
  '650488671178326016': 'Health & Beauty / Medical & Mobility',
  '650770146155036672': 'Health & Beauty / Vision Care Products',
  '651051621131747328': 'Health & Beauty / Shaving & Hair Removal Products',
  '651333096108457984': 'Health & Beauty / Natural & Alternative Remedies',
  '651614571085168640': 'Health & Beauty / Bath & Body Products',
  '651896046061879296':
    'Health & Beauty / Manicure, Pedicure & Nail Care Products',
  '652177521038589952': 'Health & Beauty / Oral Care Products',
  '652458996015300608': 'Health & Beauty / Massaging Equipment & Supplies',
  '720575940379279360': 'Business & Industrial',
  '720857415355990016':
    'Business & Industrial / Heavy Equipment, Parts & Attachments',
  '721138890332700672': 'Business & Industrial / Healthcare, Lab & Dental',
  '721420365309411328':
    'Business & Industrial / CNC, Metalworking & Manufacturing',
  '721701840286121984': 'Business & Industrial / Restaurant & Food Service',
  '721983315262832640':
    'Business & Industrial / Industrial Automation & Motion Controls',
  '722264790239543296':
    'Business & Industrial / Electrical Equipment & Supplies',
  '722546265216253952': 'Business & Industrial / Office Equipment & Supplies',
  '722827740192964608':
    'Business & Industrial / Light Industrial Equipment & Tools',
  '723109215169675264':
    'Business & Industrial / Test, Measurement & Inspection Equipment',
  '723390690146385920':
    'Business & Industrial / Hydraulics, Pneumatics, Pumps & Plumbing',
  '723672165123096576': 'Business & Industrial / Material Handling',
  '723953640099807232': 'Business & Industrial / Facility Maintenance & Safety',
  '724235115076517888': 'Business & Industrial / Retail & Services',
  '792633534417207296': 'Jewelry & Watches',
  '792915009393917952': 'Jewelry & Watches / Watches, Parts & Accessories',
  '793196484370628608': 'Jewelry & Watches / Fine Jewelry',
  '793477959347339264': 'Jewelry & Watches / Fashion Jewelry',
  '793759434324049920': 'Jewelry & Watches / Vintage & Antique Jewelry',
  '794040909300760576': "Jewelry & Watches / Men's Jewelry",
  '794322384277471232': 'Jewelry & Watches / Loose Diamonds & Gemstones',
  '794603859254181888': 'Jewelry & Watches / Engagement & Wedding Jewelry',
  '794885334230892544': 'Jewelry & Watches / Ethnic, Regional & Tribal Jewelry',
  '795166809207603200': 'Jewelry & Watches / Jewelry Care, Design & Repair',
  '864691128455135232': 'Baby Essentials',
  '864972603431845888': 'Baby Essentials / Baby Clothing, Shoes & Accessories',
  '865254078408556544': 'Baby Essentials / Strollers & Accessories',
  '936748722493063168': 'Pet Supplies',
  '937030197469773824': 'Pet Supplies / Dog Supplies',
  '937311672446484480': 'Pet Supplies / Fish & Aquariums',
};

export function categoryBigInt(main: number, sub1: number) {
  let byteArray = new Uint8Array([main, sub1, 0, 0, 0, 0, 0, 0]);
  let dataView = new DataView(byteArray.buffer);
  return dataView.getBigUint64(0);
}

export function categoryHex(main: number, sub1: number) {
  return '0x' + categoryBigInt(main, sub1).toString(16).padStart(16, '0');
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
    return '';
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
    cat.name + ' / ' + getCategoryPathByIndexes(byteIndexes, level + 1, subCat)
  );
}

export function getCategoryPath(id: bigint) {
  return getCategoryPathByIndexes(indexesById(id));
}
