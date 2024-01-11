namespace DocumentManager.Repositories;

using DocumentManager.Models.Entities;
using DocumentManager.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public interface IUserCategorySubscriptionRepository
{
    IQueryable<UserCategorySubscriptionEntity> FindAll();
    IQueryable<UserCategorySubscriptionEntity> FindAllByUserId(Guid userId = new Guid());
    IQueryable<UserCategorySubscriptionEntity> FindAllByCategoryId(Guid userId = new Guid());
    Task<UserCategorySubscriptionEntity?> FindByIds(Guid userId = new Guid(), Guid categoryId = new Guid());
    Task<UserCategorySubscriptionEntity?> Save(UserCategorySubscriptionEntity? category);
    Task DeleteByIds(Guid userId = new Guid(), Guid categoryId = new Guid());
}

public class UserCategorySubscriptionRepository : IUserCategorySubscriptionRepository
{
    private readonly ApplicationDbContext _context;

    public UserCategorySubscriptionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<UserCategorySubscriptionEntity> FindAll()
    {
        return _context.Set<UserCategorySubscriptionEntity>().AsQueryable();
    }

    public IQueryable<UserCategorySubscriptionEntity> FindAllByUserId(Guid userId = new Guid())
    {
        return _context.Set<UserCategorySubscriptionEntity>().AsQueryable()
            .Where(userCategorySubscription => userCategorySubscription.UserId == userId);
    }

    public IQueryable<UserCategorySubscriptionEntity> FindAllByCategoryId(Guid categoryId = new Guid())
    {
        return _context.Set<UserCategorySubscriptionEntity>().AsQueryable()
           .Where(userCategorySubscription => userCategorySubscription.CategoryId == categoryId);
    }

    public async Task<UserCategorySubscriptionEntity?> FindByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        return await _context.Set<UserCategorySubscriptionEntity>().AsQueryable().FirstOrDefaultAsync(userCategorySubscription => userCategorySubscription.UserId == userId && userCategorySubscription.CategoryId == categoryId);
    }

    public async Task<UserCategorySubscriptionEntity?> Save(UserCategorySubscriptionEntity? userCategorySubscription)
    {
        if (userCategorySubscription == null) return null;
        EntityEntry<UserCategorySubscriptionEntity> userCategorySubscriptionResult = _context.UsersCategoriesSubscriptions.Add(userCategorySubscription);
        await _context.SaveChangesAsync();
        return userCategorySubscriptionResult.Entity;
    }

    public async Task DeleteByIds(Guid userId = new Guid(), Guid categoryId = new Guid())
    {
        UserCategorySubscriptionEntity? userCategorySubscription = this.FindByIds(userId, categoryId)?.Result;
        if (userCategorySubscription != null)
        {
            _context.UsersCategoriesSubscriptions.Remove(userCategorySubscription);
            await _context.SaveChangesAsync();
        }
    }
}
