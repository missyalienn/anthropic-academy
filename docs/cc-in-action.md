# Claude Code in Action 

* Controlling context with commands 
* Custom commands (see .claude/commands). Restart claude code to use newly created custom commands. 


## MCP Servers with Claude 

Example: Playwright MCP server which allows Claude Code to control browser

 Navigate to terminal and run: 
`claude mcp add playright npx @playwright/mcp@latest`

  * name for the server: playwright 
  * `mcp@latest` starts server locally 


Example: 
Your goal is to improve the component generation prompt at @src/lib/prompts/generation.tsx. Here's how: 

1. Open browswer and navigate to localhost:3000\
2. Request a basic component to be generated 
3. Review the generated component and its source code
4. Identify areas for improvement 
5. Update the prompt. 