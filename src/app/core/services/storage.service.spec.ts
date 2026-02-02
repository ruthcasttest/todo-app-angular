import { StorageService } from "./storage.service";

describe("StorageService", () => {
    let service: StorageService;

    beforeEach(() => {
        service = new StorageService();
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("get", () => {
        it("should return null when key does not exist", () => {
            const result = service.get("nonexistent");
            expect(result).toBeNull();
        });

        it("should return parsed value when key exists", () => {
            const testObj = { name: "test", value: 123 };
            localStorage.setItem("testKey", JSON.stringify(testObj));

            const result = service.get<typeof testObj>("testKey");
            expect(result).toEqual(testObj);
        });

        it("should return null when JSON parse fails", () => {
            localStorage.setItem("invalidJson", "not valid json {");

            const result = service.get("invalidJson");
            expect(result).toBeNull();
        });

        it("should return string value correctly", () => {
            localStorage.setItem("stringKey", JSON.stringify("hello"));

            const result = service.get<string>("stringKey");
            expect(result).toBe("hello");
        });

        it("should return array value correctly", () => {
            const testArray = [1, 2, 3];
            localStorage.setItem("arrayKey", JSON.stringify(testArray));

            const result = service.get<number[]>("arrayKey");
            expect(result).toEqual(testArray);
        });
    });

    describe("set", () => {
        it("should store value in localStorage", () => {
            const testObj = { name: "test" };
            service.set("testKey", testObj);

            const stored = localStorage.getItem("testKey");
            expect(stored).toBe(JSON.stringify(testObj));
        });

        it("should store string value", () => {
            service.set("stringKey", "hello");

            const stored = localStorage.getItem("stringKey");
            expect(stored).toBe(JSON.stringify("hello"));
        });

        it("should store array value", () => {
            const testArray = [1, 2, 3];
            service.set("arrayKey", testArray);

            const stored = localStorage.getItem("arrayKey");
            expect(stored).toBe(JSON.stringify(testArray));
        });

        it("should overwrite existing value", () => {
            service.set("key", "first");
            service.set("key", "second");

            const result = service.get<string>("key");
            expect(result).toBe("second");
        });
    });

    describe("remove", () => {
        it("should remove key from localStorage", () => {
            localStorage.setItem("toRemove", "value");
            service.remove("toRemove");

            expect(localStorage.getItem("toRemove")).toBeNull();
        });

        it("should not throw when removing nonexistent key", () => {
            expect(() => service.remove("nonexistent")).not.toThrow();
        });
    });

    describe("clear", () => {
        it("should clear all items from localStorage", () => {
            localStorage.setItem("key1", "value1");
            localStorage.setItem("key2", "value2");

            service.clear();

            expect(localStorage.length).toBe(0);
        });
    });
});
