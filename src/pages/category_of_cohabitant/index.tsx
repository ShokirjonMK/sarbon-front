import SimpleIndexPage from 'pages/common/base_page';

const CategoryOfCohabitant = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="category-of-cohabitants"
                url="category-of-cohabitants"
                indexTitle="Category of cohabitants"
                editTitle="Category of cohabitant edit"
                viewTitle="Category of cohabitants view"
                createTitle="Category of cohabitants create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "category-of-cohabitant_view",
                    delete_: "category-of-cohabitant_delete",
                    update_: "category-of-cohabitant_update",
                    create_: "category-of-cohabitant_create"
                }}
            />
        </>
    )
}
export default CategoryOfCohabitant;

/**
 * category-of-cohabitant_index
 * category-of-cohabitant_delete
 * category-of-cohabitant_update
 * category-of-cohabitant_view
*/