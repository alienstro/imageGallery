// export interface FileObject {
//     file_id: number | null;
//     user_id: number;
//     public_file_id: number | null;
//     parent_public_folder_id: number | null;
//     parent_folder_id: number | null;
//     file_name: string;
//     file_size: number;
//     file_ext: string;
//     file_date_created: Date;
//     file_end_date: Date | null;
//     file_favorite: boolean;
//     file_isShared: boolean;
//     date_modified: Date;
//     owner_name: string;
//     access_type: string;
//     file_path: string;
// }

export interface ImageObject {
    image_id: number;
    user_id: number;
    image_name: string;
    image_size: string;
    image_ext: string;
    image_date_created: Date;
    image_path: string;
}

export interface CommentObject {
    comment_id: number;
    image_id: number;
    user_id: number;
    messages: string;
    comment_date: Date;
    user_lname: string;
    user_fname: string;
}