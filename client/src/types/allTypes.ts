import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
  language: string;
  version: string;
}

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface CodeEditorState {
  language: string;
  output: string;

  setOutput: React.Dispatch<React.SetStateAction<string>>;

  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;

  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  theme: string;
  fontSize: number;
  editor: monaco.editor.IStandaloneCodeEditor | null;
  executionResult: ExecutionResult | null;
  setExecutionResult: React.Dispatch<
    React.SetStateAction<ExecutionResult | null>
  >;

  setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}

export interface UserType {
  _id: string;
  email: string;
  name: string;
  isPro: boolean;
  proSince?: Date;
  transactionId?: string;
  orderId?: string;
  image: string;
}

export interface Snippet {
  _id: string;
  createdAt: Date;
  user: UserType;
  language: string;
  code: string;
  title: string;
  starredBy?: string[];
}
export interface UserStatsType {
  totalSnippetsByUser: { count: number }[];
  snippetsLast24h: { count: number }[];
  snippetsStarredByUser: { count: number }[];
  mostStarredLanguage: { _id: string; starCount: number }[];
  languageStats: {
    languageCount: number;
    mostUsedLanguage: {
      language: string;
      count: number;
    };
  }[];
}
export interface CommentType {
  _id: string;
  createdAt: Date;
  user: UserType;
  snippet: string;
  content: string;
}
