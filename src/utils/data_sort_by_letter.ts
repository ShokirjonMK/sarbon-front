
export const data_sort_by_letter = (data: any, name: string, objName?: string) => {

    // Alifbo asosida saralash
    const array = data.sort((a: any, b: any) => {
        // Obyektlarning `name` qiymatlarini olib, alifbo asosida saralash
        const nameA = objName ? a[objName][name]?.toUpperCase() : a[name]?.toUpperCase(); // Obyekt A ning nomi
        const nameB = objName ? b[objName][name]?.toUpperCase() : b[name]?.toUpperCase(); // Obyekt B ning nomi
    
        // Alifbo tartibida solishtirish
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
            return 0; // Tenglik
    });
    
    // Natija chiqarish
    return array
}