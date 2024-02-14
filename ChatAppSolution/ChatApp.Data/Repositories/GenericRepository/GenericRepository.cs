using ChatApp.Data.DBContext;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Data.Repositories.GenericRepository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected ChatContext _context;
        private DbSet<T> table = null;

        public GenericRepository(ChatContext context)
        {
            _context = context;
            table = _context.Set<T>();
        }

        public IQueryable<T> GetData()
        {
            return table.Where(x=> EF.Property<bool>(x, "IsDeleted") == false).AsQueryable();
        }
        public async Task<IEnumerable<T>> GetAll()
        {
            return await table.Where(x => EF.Property<bool>(x, "IsDeleted") == false).ToListAsync();
        }

        public async Task<T> GetById(object id)
        {
            return await table.Where(x => EF.Property<bool>(x, "IsDeleted") == false)
                      .FirstOrDefaultAsync(x => EF.Property<object>(x, "Id") == id);
        }
        public async Task Insert(T obj)
        {
            await table.AddAsync(obj);
        }

        public void Update(T obj)
        {
            table.Attach(obj);
            _context.Entry(obj).State = EntityState.Modified;
        }

        public async Task Delete(object id)
        {
            T existing = await table.FindAsync(id);
            _context.Entry(existing).Property("IsDeleted").CurrentValue = true;
            _context.Entry(existing).State = EntityState.Modified;
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
