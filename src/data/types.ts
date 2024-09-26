
export enum EventType {
    Clubbing = "clubbing",
    Comedy = "comedy",
    Festival = "festival",
    Concerts = "concerts",
    Sports = "sports",
    Theater = "theater",
    Conference = "conference",
    Exhibition = "exhibition",
    Workshop = "workshop",
    Seminar = "seminar",
    Movie = "movie",
}

export enum VenueType {
    ConcertHall = "Concert Hall",
    Theater = "Theater",
    Stadium = "Stadium",
    ConferenceCenter = "Conference Center",
    OutdoorPark = "Outdoor Park",
    Nightclub = "Nightclub",
    ArtGallery = "Art Gallery",
    Museum = "Museum",
    BanquetHall = "Banquet Hall",
    ExhibitionCenter = "Exhibition Center",
    HotelBallroom = "Hotel Ballroom",
    SportsArena = "Sports Arena",
    CivicCenter = "Civic Center",
    Beach = "Beach",
    Rooftop = "Rooftop",
    CommunityCenter = "Community Center",
    Amphitheater = "Amphitheater",
    PrivateResidence = "Private Residence",
    RestaurantBar = "Restaurant/Bar",
    Garden = "Garden",
    Warehouse = "Warehouse",
    Arena = "Arena",
    ShoppingMall = "Shopping Mall",
    ConventionHall = "Convention Hall",
    Cafe = "Café"
}

// Extract constant array for potential reuse and increased readability
export const EventTypeList = [
    EventType.Clubbing,
    EventType.Comedy,
    EventType.Festival,
    EventType.Concerts,
    EventType.Sports,
    EventType.Theater,
    EventType.Conference,
    EventType.Exhibition,
    EventType.Workshop,
    EventType.Seminar,
    EventType.Movie
];

export const VenueTypeList = [
    VenueType.ConcertHall,
    VenueType.Theater,
    VenueType.Stadium,
    VenueType.ConferenceCenter,
    VenueType.OutdoorPark,
    VenueType.Nightclub,
    VenueType.ArtGallery,
    VenueType.Museum,
    VenueType.BanquetHall,
    VenueType.ExhibitionCenter,
    VenueType.HotelBallroom,
    VenueType.SportsArena,
    VenueType.CivicCenter,
    VenueType.Beach,
    VenueType.Rooftop,
    VenueType.CommunityCenter,
    VenueType.Amphitheater,
    VenueType.PrivateResidence,
    VenueType.RestaurantBar,
    VenueType.Garden,
    VenueType.Warehouse,
    VenueType.Arena,
    VenueType.ShoppingMall,
    VenueType.ConventionHall,
    VenueType.Cafe
]

export interface EventModel {

    subCategory?: string;

    image: string[];
    viewCount: number;
    weightedRating: number;
    ticketSales: number;

    eventName: string;
    eventHostId: string;
    poster: string;
    eventDate: Date; // Event date
    location: string;
    // price: number;
    cover: string;
    _id: string;
    description: string;
    category: EventType;
    ticketInfo: Ticket[];
    discount?: Discount[];
    createdAt: Date;
    startSalesDate?: Date; // Optional
    endSalesDate?: Date; // Optional
    eventEnd?: string; // Optional
    minAge?: number; // Optional minimum age restriction
    dress?: string; // Optional dress code
    lastEntry?: string;
    country: string;
    currency: string;
    approved: boolean;
    venue: {
        name: string;
        street: string;
        city: string;
        country: string;
        district: string;
        saved: boolean;
        id?: string;
    };
    revenue: number,
    scanners: Scanner[],
}

export interface Ticket {
    _id: string;
    ticketType: string;
    price: number;
    ticketsAvailable: number;
    ticketsLeft: number;
    sold: number;
    saleEnd?: Date | string; // Optional
    saleStart?: Date | string; // Optional
}
export interface Discount {
    id: string;
    ticketIds: string[];
    type: 'FlatRate' | 'Percentage';
    value: number;
    start: Date;
    end: Date;
}

export interface Venue {
    _id: string;
    name: string;
    street: string;
    city: string;
    district: string;
    country: string;
    links: { name: string, url: string }[];
    followers: number;
    images: string[];
    capacity: number;
    type: VenueType;
    yearEvents: number | 0;
    description?: string;
    phone: string;
    email: string;
    poster: string;
    userId: string;
    events?: EventModel[];
}

export interface CartItem {
    id: string;
    name: string;
    amount: number;
    price: number;
}



export interface Purchase {
    eventId: string;
    attendeeId: string;
    paymentMethod?: string;
    ticketInfo: { ticketType: string, numberOfTickets: number}[ ];
    totalPrice?: number;
    amountPaid?: number;
    status?: string;
    paymentId?: string;
    createdAt: Date;
    _id: string;
}



export interface CombinedTicket {
    _id: string;
    eventId: EventModel;
    attendeeId: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    paymentMethod: string;
    ticketInfo: {
        _id: string;
        ticketType: string;
        numberOfTickets: number;
    }[];
    totalPrice: number;
    status: string;
    scanned: boolean;
    createdAt: string;
    amountPaid: number;
}

export interface Transaction {
    _id: string;
    reference: string;
    eventId: string;
    hostId: string;
    attendeeId: string;
    user?: {
        [ key: string ]: string;
    }
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    createdAt?: Date;
    updatedAt?: Date;
    cumulativeRevenue: number | 0;
}

export type Scanner = {
    _id:string,
    eventId: string,
    email: string,
    activated: boolean,
    name: string,
    scannedTickets: number,
};

export interface User {
    id:string
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    organization?: string;
    gender?: string;
    phone?: number;
    country: string;
    activatedEmail?: boolean;
    activatedPhone?: boolean;
    userType: string;
    image?: string[];
    accountActive?: boolean;
    createdAt?: Date;
}

export interface WithdrawalAccount {
    account_number: string;
    bank_code: string;
    amount: number;
    currency: string;
    account_name?: string;
    description?: string;
    reference?: string;
}