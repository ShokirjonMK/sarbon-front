import SimpleIndexPage from 'pages/common/base_page';
import { TypeFormUIData } from 'pages/common/types';
import { TypeFilterSelect } from 'components/FilterSelect';

const formData: TypeFormUIData[] = [
    {
        name: "building_id",
        label: "Building",
        required: false,
        type: "select",
        url: "buildings",
        span: 24,
        expand_name: "building"
    },
    {
        name: "room_type_id",
        label: "Room type",
        url: "room-types",
        type: "select",
        span: 24,
    },
    {
        name: "capacity",
        label: "Capacity",
        type: "number",
        span: 24,
        max: 100,
    },
    {
        name: "room_size",
        label: "Room size",
        type: "number",
        span: 24,
    }
]

const selectData: TypeFilterSelect[] = [
    {
        name: "building_id",
        label: "Building",
        url: "buildings",
        permission: "building_index",
        span: {xs:24, sm: 24, md: 12, lg:6, xl:4}
    },
    {
        name: "room_type_id",
        label: "Room type",
        url: "room-types",
        permission: "room-type_index",
        span: {xs:24, sm: 24, md: 12, lg:6, xl:4}
    }
]

const Rooms = () => {

    return (
        <SimpleIndexPage
            queryKey="rooms"
            url="rooms"
            indexTitle="Rooms"
            editTitle="Room edit"
            viewTitle="Room view"
            createTitle="Room create"
            search={true}
            isMain={false}
            permissions={{
                view_: "room_view",
                delete_: "room_delete",
                update_: "room_update",
                create_: "room_create"
            }}
            formUIData={formData}
            selectData={selectData}
        />
    )
}
export default Rooms;

/**
 * room_index
 * room_delete
 * room_update
 * room_view
 */