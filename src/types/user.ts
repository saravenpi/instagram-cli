export type User = {
    fullName: string;
    username: string;
    id: number;
    profilePictureUrl: string,
}

export const castUser = (userData: any): User => {
    var user = {
        fullName: userData.full_name,
        username: userData.username,
        id: userData.pk,
        profilePictureUrl: userData.profile_pic_url
    } as User
    return user
}

export default User