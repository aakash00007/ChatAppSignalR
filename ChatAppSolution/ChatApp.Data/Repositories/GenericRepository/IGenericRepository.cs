namespace ChatApp.Data.Repositories.GenericRepository
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();
        IQueryable<T> GetData();
        Task<T> GetById(object id);
        Task Insert(T obj);
        void Update(T obj);
        Task Delete(object id);
        Task Save();
    }
}
