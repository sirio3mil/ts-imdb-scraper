export interface Searchable<T> {
    search(query: string): Promise<T[]>;
}
