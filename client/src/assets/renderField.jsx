export function renderField(key, config, form, update) {
    const value = form[key];

    // 1. TEXT / NUMBER
    if (config.type === "text" || config.type === "number") {
        return (
            <input
                className="info-edit"
                type={config.type}
                value={value || ""}
                onChange={(e) => update(key, e.target.value)}
            />
        );
    }

    // 2. SELECT
    if (config.type === "select") {
        return (
            <select
                className="info-edit"
                value={value || ""}
                onChange={(e) => update(key, e.target.value)}
            >
                <option value="">Select</option>
                {config.options.map((op) => (
                    <option key={op} value={op}>
                        {op}
                    </option>
                ))}
            </select>
        );
    }

    // 3. ARRAY
    if (config.type === "array") {
        return (
            <input
                className="info-edit"
                value={Array.isArray(value) ? value.join(", ") : ""}
                onChange={(e) =>
                    update(
                        key,
                        e.target.value.split(",").map((s) => s.trim())
                    )
                }
            />
        );
    }

    // 4. OBJECT
    if (config.type === "object") {
        return Object.keys(config.children).map((subKey) => (
            <div key={subKey} className="info-row full-width">
                <span className="info-label">{subKey}:</span>
                <input
                    className="info-edit"
                    value={value?.[subKey] || ""}
                    onChange={(e) =>
                        update(key, {
                            ...(value || {}),
                            [subKey]: e.target.value,
                        })
                    }
                />
            </div>
        ));
    }
}
