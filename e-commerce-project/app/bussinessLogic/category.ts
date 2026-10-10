import { categoryDb } from "../database/data";



export const categoryBusiness = {

    createCategory: async function (data: {
        name: string;
        imageUrl: string;
        description?: string | null;
    }) {

        if (!data.name || !data.name.trim()) {
            return {
                success: false,
                message: "Category name is required",
            };
        }

        if (!data.imageUrl || !data.imageUrl.trim()) {
            return {
                success: false,
                message: "Category image is required",
            };
        }

        const name = data.name.trim();

        const exists =
            await categoryDb.categoryNameExists(name);

        if (exists) {
            return {
                success: false,
                message:
                    "A category with this name already exists",
            };
        }

        const category =
            await categoryDb.createCategory({
                name,
                imageUrl: data.imageUrl,
                description:
                    data.description?.trim() || null,
            });

        return {
            success: true,
            data: category,
        };
    },


    getCategoryById: async function (id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const category =
            await categoryDb.getCategoryById(id);

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        return {
            success: true,
            data: category,
        };
    },


    getCategoryByName: async function (name: string) {

        if (!name || !name.trim()) {
            return {
                success: false,
                message: "Category name is required",
            };
        }

        const category =
            await categoryDb.getCategoryByName(
                name.trim()
            );

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        return {
            success: true,
            data: category,
        };
    },


    getCategoryWithProducts: async function (id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const category =
            await categoryDb.getCategoryWithProducts(id);

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        return {
            success: true,
            data: category,
        };
    },


    getCategoryWithProductCount: async function (
        id: number
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const category =
            await categoryDb.getCategoryWithProductCount(id);

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        return {
            success: true,
            data: category,
        };
    },


    getCategories: async function (
        sortBy?: string,
        order?: string
    ) {

        const allowedSortFields = [
            "id",
            "name",
        ];

        const safeSortBy =
            sortBy &&
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "id";

        const safeOrder: "asc" | "desc" =
            order === "desc"
                ? "desc"
                : "asc";

        const categories =
            await categoryDb.getCategories(
                safeSortBy,
                safeOrder
            );

        return {
            success: true,
            data: categories,
        };
    },


    getCategoriesWithProducts: async function (
        sortBy?: string,
        order?: string
    ) {

        const allowedSortFields = [
            "id",
            "name",
        ];

        const safeSortBy =
            sortBy &&
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "id";

        const safeOrder: "asc" | "desc" =
            order === "desc"
                ? "desc"
                : "asc";

        const categories =
            await categoryDb.getCategoriesWithProducts(
                safeSortBy,
                safeOrder
            );

        return {
            success: true,
            data: categories,
        };
    },


    getCategoriesWithProductCounts: async function (
        sortBy?: string,
        order?: string
    ) {

        const allowedSortFields = [
            "id",
            "name",
        ];

        const safeSortBy =
            sortBy &&
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "id";

        const safeOrder: "asc" | "desc" =
            order === "desc"
                ? "desc"
                : "asc";

        const categories =
            await categoryDb.getCategoriesWithProductCounts(
                safeSortBy,
                safeOrder
            );

        return {
            success: true,
            data: categories,
        };
    },


    updateCategory: async function (
        id: number,
        data: {
            name?: string;
            imageUrl?: string;
            description?: string | null;
        }
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const category =
            await categoryDb.getCategoryById(id);

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        if (
            data.name !== undefined &&
            !data.name.trim()
        ) {
            return {
                success: false,
                message:
                    "Category name cannot be empty",
            };
        }

        if (
            data.name !== undefined &&
            data.name.trim() !== category.name
        ) {

            const exists =
                await categoryDb.categoryNameExists(
                    data.name.trim()
                );

            if (exists) {
                return {
                    success: false,
                    message:
                        "A category with this name already exists",
                };
            }
        }

        if (
            data.imageUrl !== undefined &&
            !data.imageUrl.trim()
        ) {
            return {
                success: false,
                message:
                    "Category image cannot be empty",
            };
        }

        const updatedCategory =
            await categoryDb.updateCategory(
                id,
                {
                    ...(data.name !== undefined && {
                        name: data.name.trim(),
                    }),

                    ...(data.imageUrl !== undefined && {
                        imageUrl: data.imageUrl,
                    }),

                    ...(data.description !== undefined && {
                        description:
                            data.description?.trim() || null,
                    }),
                }
            );

        return {
            success: true,
            data: updatedCategory,
        };
    },


    updateCategoryName: async function (
        id: number,
        name: string
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        if (!name || !name.trim()) {
            return {
                success: false,
                message:
                    "Category name is required",
            };
        }

        const category =
            await categoryDb.getCategoryById(id);

        if (!category) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        const newName = name.trim();

        if (newName === category.name) {
            return {
                success: true,
                data: category,
            };
        }

        const exists =
            await categoryDb.categoryNameExists(
                newName
            );

        if (exists) {
            return {
                success: false,
                message:
                    "A category with this name already exists",
            };
        }

        const updatedCategory =
            await categoryDb.updateCategoryName(
                id,
                newName
            );

        return {
            success: true,
            data: updatedCategory,
        };
    },


    updateCategoryImage: async function (
        id: number,
        imageUrl: string
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        if (!imageUrl || !imageUrl.trim()) {
            return {
                success: false,
                message:
                    "Category image is required",
            };
        }

        const exists =
            await categoryDb.categoryExists(id);

        if (!exists) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        const updatedCategory =
            await categoryDb.updateCategoryImage(
                id,
                imageUrl
            );

        return {
            success: true,
            data: updatedCategory,
        };
    },


    updateCategoryDescription: async function (
        id: number,
        description: string | null
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const exists =
            await categoryDb.categoryExists(id);

        if (!exists) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        const updatedCategory =
            await categoryDb.updateCategoryDescription(
                id,
                description?.trim() || null
            );

        return {
            success: true,
            data: updatedCategory,
        };
    },


    deleteCategory: async function (id: number) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const exists =
            await categoryDb.categoryExists(id);

        if (!exists) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        const result =
            await categoryDb.deleteEmptyCategory(id);

        if (!result.deleted) {
            return {
                success: false,
                message:
                    "Category cannot be deleted because it contains products",
            };
        }

        return {
            success: true,
            message:
                "Category deleted successfully",
        };
    },


    searchCategories: async function (
        search: string
    ) {

        if (!search || !search.trim()) {
            return {
                success: false,
                message: "Search term is required",
            };
        }

        const categories =
            await categoryDb.searchCategories(
                search.trim()
            );

        return {
            success: true,
            data: categories,
        };
    },


    getCategoriesPaginated: async function (
        page: number = 1,
        limit: number = 20,
        sortBy: string = "id",
        order: string = "asc"
    ) {

        if (
            !Number.isInteger(page) ||
            page < 1
        ) {
            return {
                success: false,
                message: "Invalid page",
            };
        }

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return {
                success: false,
                message: "Invalid limit",
            };
        }

        const allowedSortFields = [
            "id",
            "name",
        ];

        const safeSortBy =
            allowedSortFields.includes(sortBy)
                ? sortBy
                : "id";

        const safeOrder: "asc" | "desc" =
            order === "desc"
                ? "desc"
                : "asc";

        const result =
            await categoryDb.getCategoriesPaginated(
                page,
                limit,
                safeSortBy,
                safeOrder
            );

        return {
            success: true,
            data: result,
        };
    },


    getCategoryStats: async function (
        id: number
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const stats =
            await categoryDb.getCategoryStats(id);

        if (!stats) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        return {
            success: true,
            data: stats,
        };
    },


    countCategories: async function () {

        const count =
            await categoryDb.countCategories();

        return {
            success: true,
            data: count,
        };
    },


    countCategoryProducts: async function (
        id: number
    ) {

        if (!Number.isInteger(id) || id <= 0) {
            return {
                success: false,
                message: "Invalid category ID",
            };
        }

        const exists =
            await categoryDb.categoryExists(id);

        if (!exists) {
            return {
                success: false,
                message: "Category not found",
            };
        }

        const count =
            await categoryDb.countCategoryProducts(id);

        return {
            success: true,
            data: count,
        };
    },
};

 
