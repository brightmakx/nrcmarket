
import { describe, it, expect, vi, beforeEach } from "vitest";

import { getProducts } from "../app/bussinessLogic/products";
import { productsDb } from "../app/database/data";


describe("getProducts", () => {

    beforeEach(() => {
        vi.restoreAllMocks();
    });


    it("should call getProducts when no search is provided", async () => {

        const mockProducts = [
            {
                id: 1,
                name: "Samsung Phone",
            },
        ];

        const getProductsSpy = vi
            .spyOn(productsDb, "getProducts")
            .mockResolvedValue(mockProducts as any);

        const searchProductsSpy = vi
            .spyOn(productsDb, "searchProducts")
            .mockResolvedValue([] as any);


        const result = await getProducts(
            10,
            "desc",
            1
        );


        expect(getProductsSpy).toHaveBeenCalledWith(
            "desc",
            10,
            1,
            undefined,
            undefined
        );

        expect(searchProductsSpy).not.toHaveBeenCalled();

        expect(result).toEqual(mockProducts);
    });


    it("should call searchProducts when search is provided", async () => {

        const mockProducts = [
            {
                id: 1,
                name: "Power Bank",
            },
        ];

        const getProductsSpy = vi
            .spyOn(productsDb, "getProducts")
            .mockResolvedValue([] as any);

        const searchProductsSpy = vi
            .spyOn(productsDb, "searchProducts")
            .mockResolvedValue(mockProducts as any);


        const result = await getProducts(
            10,
            "desc",
            1,
            "power bank"
        );


        expect(searchProductsSpy).toHaveBeenCalledWith(
            "power bank",
            10,
            1,
            undefined,
            undefined
        );

        expect(getProductsSpy).not.toHaveBeenCalled();

        expect(result).toEqual(mockProducts);
    });


    it("should use getProducts when search contains only whitespace", async () => {

        const mockProducts = [
            {
                id: 1,
                name: "Samsung Phone",
            },
        ];

        const getProductsSpy = vi
            .spyOn(productsDb, "getProducts")
            .mockResolvedValue(mockProducts as any);

        const searchProductsSpy = vi
            .spyOn(productsDb, "searchProducts")
            .mockResolvedValue([] as any);


        const result = await getProducts(
            10,
            "asc",
            2,
            "   "
        );


        expect(getProductsSpy).toHaveBeenCalledWith(
            "asc",
            10,
            2,
            undefined,
            undefined
        );

        expect(searchProductsSpy).not.toHaveBeenCalled();

        expect(result).toEqual(mockProducts);
    });


    it("should return the result from searchProducts", async () => {

        const mockProducts = [
            {
                id: 1,
                name: "Power Bank",
            },
        ];

        const searchProductsSpy = vi
            .spyOn(productsDb, "searchProducts")
            .mockResolvedValue(mockProducts as any);


        const result = await getProducts(
            20,
            undefined,
            2,
            "Power Bank"
        );


        expect(searchProductsSpy).toHaveBeenCalledWith(
            "Power Bank",
            20,
            2,
            undefined,
            undefined
        );

        expect(result).toEqual(mockProducts);
    });

});

