import Markdown from "react-markdown";

const DashboardPage = () => {
    const hometext = `
# This dashboard page is under construction

You should expect to find things like:
- notifications
- shortcuts to tasks
- summaries
- widgets
`

    return (
        <Markdown>
            {hometext}
        </Markdown>
    );
};

export default DashboardPage;