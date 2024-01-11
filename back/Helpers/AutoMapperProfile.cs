namespace DocumentManager.Helpers;

using AutoMapper;
using DocumentManager.Models.Entities;
using DocumentManager.Models.DTO.Category.Request;
using DocumentManager.Models.DTO.Category.Response;
using DocumentManager.Models.DTO.Document.Request;
using DocumentManager.Models.DTO.Document.Response;
using DocumentManager.Models.DTO.User.Request;
using DocumentManager.Models.DTO.User.Response;
using DocumentManager.Models.DTO.Role.Response;
using DocumentManager.Models.DTO.Role.Request;
using DocumentManager.Models.DTO.UserCategorySubscription.Request;
using DocumentManager.Models.DTO.UserCategorySubscription.Response;
using DocumentManager.Models.DTO.CategoryDocument.Request;
using DocumentManager.Models.DTO.CategoryDocument.Response;
using DocumentManager.Models.DTO.UserRole.Response;
using DocumentManager.Models.DTO.UserRole.Request;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User
        CreateMap<UserCreateRequest, UserEntity>();
        CreateMap<UserUpdateRequest, UserEntity>();
        CreateMap<UserEntity, BaseUserResponse>();
        CreateMap<UserEntity, UserResponse>();
        CreateMap<UserCreateRequest, UserResponse>();
        CreateMap<UserUpdateRequest, UserResponse>();
        CreateMap<UserResponse, UserEntity>()
            .ForMember(dest => dest.Roles, opt => opt.Ignore());


        // Role
        CreateMap<RoleCreateRequest, RoleEntity>();
        CreateMap<RoleUpdateRequest, RoleEntity>();
        CreateMap<RoleEntity, BaseRoleResponse>();
        CreateMap<RoleEntity, RoleResponse>();
        CreateMap<RoleCreateRequest, RoleResponse>();
        CreateMap<RoleUpdateRequest, RoleResponse>();

        // UserRole
        CreateMap<UserRoleCreateRequest, UserRoleEntity>();
        CreateMap<UserRoleUpdateRequest, UserRoleEntity>();
        CreateMap<UserRoleEntity, BaseUserRoleResponse>();
        CreateMap<UserRoleEntity, UserRoleResponse>();

        // Category
        CreateMap<CategoryCreateRequest, CategoryEntity>();
        CreateMap<CategoryUpdateRequest, CategoryEntity>()
            .ForMember(c => c.Id, m => m.Ignore());
        CreateMap<CategoryCreateRequest, CategoryResponse>();
        CreateMap<CategoryUpdateRequest, CategoryResponse>();
        CreateMap<CategoryEntity, BaseCategoryResponse>();
        CreateMap<CategoryEntity, CategoryResponse>();

        // CategoryDocument
        CreateMap<CategoryDocumentCreateRequest, CategoryDocumentEntity>();
        CreateMap<CategoryDocumentCreateRequest, CategoryDocumentResponse>();
        CreateMap<CategoryDocumentEntity, BaseCategoryDocumentResponse>();
        CreateMap<CategoryDocumentEntity, CategoryDocumentResponse>();
        CreateMap<CategoryDocumentEntity, CategoryDocumentResponse>();
        // Pour la validation d'un document utilisé dans le Controller DocumentController dans la méthode ValidateById
        CreateMap<DocumentResponse, DocumentUpdateRequest>();

        // UserCategorySubscription
        CreateMap<UserCategorySubscriptionCreateRequest, UserCategorySubscriptionEntity>();
        CreateMap<UserCategorySubscriptionCreateRequest, UserCategorySubscriptionResponse>();
        CreateMap<UserCategorySubscriptionEntity, BaseUserCategorySubscriptionResponse>();
        CreateMap<UserCategorySubscriptionEntity, UserCategorySubscriptionResponse>();

        // Document
        CreateMap<DocumentCreateRequest, DocumentEntity>();
        CreateMap<DocumentUpdateRequest, DocumentEntity>();
        CreateMap<DocumentEntity, BaseDocumentResponse>();
        CreateMap<DocumentEntity, DocumentResponse>();
        CreateMap<DocumentCreateRequest, DocumentResponse>();
        CreateMap<DocumentUpdateRequest, DocumentResponse>();

        /**
         * Le mapping d'une réponse vers une entité sert quand il y a des relations clés étrangères
         car c'est une entité response qui est donné dans l'objet DTO(Data Transfer Object, ex: UserCategorySubscriptionCreateRequest) 
         pour faire référence à la clé étrangère. Cela parceque, une réponse renvoie l'identifiant de l'entité. 
        */
        CreateMap<BaseCategoryResponse, CategoryEntity>();
        CreateMap<BaseUserResponse, UserEntity>();
        CreateMap<BaseDocumentResponse, DocumentEntity>();
    }
}