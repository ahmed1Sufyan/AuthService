function login(username: string): string {
    const user = {
        name: 'Sufyan',
    };
    return username + user['name'];
}

login('sufyan');
