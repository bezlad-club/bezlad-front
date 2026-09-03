import { revalidatePath } from "next/cache";

export const revalidateHomepage = () => {
    try {
        revalidatePath("/");
    } catch {
        return;
    }
};
