import telanganaDistricts from "../data/telanganaDistricts.js";

const normalize = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase();
};

export const getDistrictFromCity = (city) => {
    const normalizedCity = normalize(city);

    for (const [district, cities] of Object.entries(telanganaDistricts)) {
        const found = cities.some(
            (item) => normalize(item) === normalizedCity
        );

        if (found) {
            return district;
        }
    }

    return null;
};

export const getCitiesByDistrict = (district) => {
    const matchedDistrict = Object.keys(telanganaDistricts).find(
        (item) => normalize(item) === normalize(district)
    );

    if (!matchedDistrict) {
        return [];
    }

    return telanganaDistricts[matchedDistrict];
};

export const getAllDistricts = () => {
    return Object.keys(telanganaDistricts);
};