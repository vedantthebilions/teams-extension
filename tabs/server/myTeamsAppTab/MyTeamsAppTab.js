import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/myTeamsAppTab/index.html")
@PreventIframe("/myTeamsAppTab/config.html")
@PreventIframe("/myTeamsAppTab/remove.html")
export class MyTeamsAppTab {
}
