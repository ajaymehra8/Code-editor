"use client";
import { CodeEditorState, ExecutionResult, Snippet, UserType } from "@/types/allTypes";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";

// Define the shape of the context
interface GlobalContextType extends CodeEditorState {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  openSignupModal:boolean;
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  snippets:Snippet[];
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
}

// Create context with a default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string>("");
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);

  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [fontSize, setFontSize] = useState<number>(16);
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [snippets,setSnippets]=useState<Snippet[]>([]);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null);
  // Function to get code from the editor
  const getCode = () => editorInstance?.getValue() || "";

  // Function to run the code (dummy function for now)
  const runCode = async () => {
    const code = getCode();

    if (!code) {
      setError("Please enter some code");
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput("");
    try {
      const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      console.log("data back from piston:", data);

      // handle API-level erros
      if (data.message) {
        setError(data.message);
        setExecutionResult({ code, output: "", error: data.message });
        return;
      }

      // handle compilation errors
      if (data.compile && data.compile.code !== 0) {
        const error = data.compile.stderr || data.compile.output;
        setError(error);
        setExecutionResult({
          code,
          output: "",
          error,
        });
        return;
      }

      if (data.run && data.run.code !== 0) {
        const error = data.run.stderr || data.run.output;
        setError(error);
        setExecutionResult({
          code,
          output: "",
          error,
        });
        return;
      }

      // if we get here, execution was successful
      const output = data.run.output;
      setOutput(output.trim());
      setError(null);
      setExecutionResult({
        code,
        output: output.trim(),
        error: null,
      });
    } catch (error) {
      console.log("Error running code:", error);
      setError("Error running code");
      setExecutionResult({ code, output: "", error: "Error running code" });
    } finally {
      setIsRunning(false);
    }
  };

  const getInitialState = () => {
    if (typeof window === "undefined") return;
    const savedLanguage =
      localStorage.getItem("editor-language") || "javascript";
    const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
    const savedFontSize =
      Number(localStorage.getItem("editor-font-size")) || 16;

    setFontSize(savedFontSize);
    setLanguage(savedLanguage);
    setTheme(savedTheme);
  };

  const fetchUserDetails = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      setUser(null);
      setToken("");
      return;
    }

    try {
      const parsedUser: UserType = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    document.body.style.overflow = openSignupModal ? "hidden" : "auto";

    // Optional cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openSignupModal]);

  useEffect(() => {
    fetchUserDetails();
    getInitialState();
  }, []);
  useEffect(() => {
    console.log(editorInstance);
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    if (savedCode) editorInstance?.setValue(savedCode);
  }, [editorInstance, language]);
  useEffect(() => {
    localStorage.setItem("editor-font-size", fontSize.toString());
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem("editor-theme", theme);
  }, [theme]);
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        language,
        setLanguage,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        editor: editorInstance, // ✅ Added editor
        setEditor: setEditorInstance, // ✅ Added setEditor function
        getCode, // ✅ Added getCode function
        runCode, // ✅ Added runCode function
        output,
        setOutput,
        isRunning,
        setIsRunning,
        error,
        setError,
        executionResult,
        setExecutionResult,
        openSignupModal,
        setOpenSignupModal,
        snippets,
        setSnippets
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use context
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
};
