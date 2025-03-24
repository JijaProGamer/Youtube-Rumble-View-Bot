export type Options = {
    max_seconds_ads: number,
    skip_ads_after: number[],
    close_server_on_finish: boolean,
    send_reminders: boolean,

    headless: boolean,
    concurrency: number,

    concurrencyInterval: number,
    timeout: number,
    disable_proxy_tests: boolean,

    stop_spawning_on_overload: boolean,
    auto_skip_ads: boolean,
    server_port: number,
    
    api_key: string,
    free_api_key: string,
    default_proxy_protocol: string,

    use_AV1: boolean,
};