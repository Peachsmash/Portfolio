// Hardcoded images mapped by ID - Updated to high res for larger cards
export const projectImages: Record<number, string> = {
    1: "/Overload-dc4.png",
    2: "/web_design_portfolio_photo4.webp",
    3: "/web_design_portfolio_photo1.webp",
    4: "/szybka-wymianka5.png", // Added leading slash for absolute path reliability
    5: "/web_design_portfolio_photo2.webp",
    6: "/web_design_portfolio_photo3.webp",
};

// Gallery images for the lightbox carousel
// Only Project 1 has a carousel with multiple images
export const projectGalleries: Record<number, string[]> = {
    1: [
        "/Overload-dc4.png",
        "/Overload-dc6.png",
        "/Overload-dc5.png"
    ],
        5: [
        "/web_design_portfolio_photo4.webp",
        "/web_design_portfolio_photo3.webp",
        "/web_design_portfolio_photo1.webp"
    ]
};
// IDs of projects that are currently ongoing and should be displayed as such in the Works section

export const ongoingIds = [2, 3, 6];


