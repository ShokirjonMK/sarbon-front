import SimpleIndexPage from 'pages/common/base_page';

const RoomTypes = () => {

    return (
        <>
            <SimpleIndexPage
                queryKey="room-types"
                url="room-types"
                indexTitle="Room types"
                editTitle="Room type edit"
                viewTitle="Room type view"
                createTitle="Room type create"
                search={true}
                isMain={false}
                permissions={{
                    view_: "room-type_view",
                    delete_: "room-type_delete",
                    update_: "room-type_update",
                    create_: "room-type_create"
                }}
            />
        </>
    )
}
export default RoomTypes;

/**
 * room-type_index
 * room-type_delete
 * room-type_update
 * room-type_view
 */