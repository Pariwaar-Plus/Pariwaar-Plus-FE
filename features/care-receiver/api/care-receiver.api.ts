import { CareReceiver } from "../types/care-receiver.type";

// mock DB (temporary)
let careReceivers: CareReceiver[] = [
    {
        id: "r1",
        name: "Hari Sharma",
        dob: "1948-03-12",
        gender: "MALE",

        address: "Kathmandu-10",
        city: "Kathmandu",
        googleMapsUrl: "https://maps.google.com/example",
        contact: "9800000000",

        medicalConditions: ["Diabetes", "Hypertension"],
        dependencyLevel: "HIGH",

        clientId: "c1",
        assignedAgentId: "1",

        status: "ACTIVE",

        createdAt: new Date().toISOString(),
    },
];

// delay helper
const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

//    READ
export const getCareReceivers = async (): Promise<CareReceiver[]> => {
    await delay(600);
    return careReceivers;
};

//    CREATE
export const createCareReceiver = async (
    data: Omit<CareReceiver, "id" | "createdAt" | "updatedAt">
): Promise<CareReceiver> => {
    await delay(700);

    const newReceiver: CareReceiver = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    careReceivers.push(newReceiver);

    return newReceiver;
};

//    UPDATE
export const updateCareReceiver = async (
    id: string,
    data: Partial<CareReceiver>
): Promise<CareReceiver> => {
    await delay(700);

    const index = careReceivers.findIndex((r) => r.id === id);

    if (index === -1) {
        throw new Error("Care Receiver not found");
    }

    careReceivers[index] = {
        ...careReceivers[index],
        ...data,
        updatedAt: new Date().toISOString(),
    };

    return careReceivers[index];
};

//    DELETE
export const deleteCareReceiver = async (
    id: string
): Promise<{ id: string }> => {
    await delay(500);

    const exists = careReceivers.some((r) => r.id === id);

    if (!exists) {
        throw new Error("Care Receiver not found");
    }

    careReceivers = careReceivers.filter((r) => r.id !== id);

    return { id };
};