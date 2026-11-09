export interface BaseRepository<TEntity, TId = string> {
  findAll(): Promise<TEntity[]>;
  findById(id: TId): Promise<TEntity | null>;
  create(data: Partial<TEntity>): Promise<TEntity>;
  update(id: TId, data: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: TId): Promise<void>;
}
