import { Datepicker } from "flowbite-react";
import { Field, ErrorMessage } from "formik";
import { formatToISO8601 } from "../utils/dateFormater.js"; // ← Usa tu dateFormatter

function FormDatePicker({ 
  name, 
  label, 
  placeholder = "📅 Selecciona una fecha", 
  disabled = false,
  required = false 
}) {
  return (
    <div>
      {/* Solo muestra label si se pasa la prop */}
      {label && (
        <label className="block text-white font-medium mb-2">
          {label} {required && "*"}
        </label>
      )}
      <Field name={name}>
        {({ field, form }) => (
          <Datepicker
            value={field.value ? new Date(field.value) : null}
            onSelectedDateChanged={(date) => {
              // ✅ Usa tu dateFormatter de utils
              const formattedDate = date ? date.toISOString().split('T')[0] : '';
              console.log('📅 Fecha seleccionada:', formattedDate, '| Campo:', name); // Para debug
              form.setFieldValue(name, formattedDate);
            }}
            placeholder={placeholder}
            disabled={disabled}
            weekStart={1}
            autoHide={true}
            showClearButton={true}
            showTodayButton={true}
            todayBtn="📅 Hoy"
            clearBtn="🗑️ Limpiar"
            theme={{
              root: {
                base: "relative"
              },
              popup: {
                root: {
                  base: "absolute top-10 z-50 block pt-2",
                  inline: "relative top-0 z-auto",
                  inner: "inline-block rounded-lg bg-slate-800 p-4 shadow-lg border border-slate-600"
                },
                header: {
                  base: "",
                  title: "px-2 py-3 text-center font-semibold text-gray-200",
                  selectors: {
                    base: "flex justify-between mb-2",
                    button: {
                      base: "text-sm rounded-lg text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 px-5 py-2.5 text-center",
                      prev: "px-3 py-2 text-xs",
                      next: "px-3 py-2 text-xs",
                      view: "px-3 py-2 text-xs"
                    }
                  }
                }
              },
              views: {
                days: {
                  header: {
                    base: "grid grid-cols-7 mb-1",
                    title: "dow h-6 text-center text-sm font-medium leading-6 text-gray-400"
                  },
                  items: {
                    base: "grid w-64 grid-cols-7",
                    item: {
                      base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-200 hover:bg-slate-600",
                      selected: "bg-purple-600 text-white hover:bg-purple-700",
                      disabled: "text-gray-500 cursor-not-allowed hover:bg-transparent"
                    }
                  }
                },
                months: {
                  items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                      base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-200 hover:bg-slate-600",
                      selected: "bg-purple-600 text-white hover:bg-purple-700",
                      disabled: "text-gray-500"
                    }
                  }
                },
                years: {
                  items: {
                    base: "grid w-64 grid-cols-4",
                    item: {
                      base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-200 hover:bg-slate-600",
                      selected: "bg-purple-600 text-white hover:bg-purple-700",
                      disabled: "text-gray-500"
                    }
                  }
                }
              }
            }}
          />
        )}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-400 text-sm mt-1" />
    </div>
  );
}

export default FormDatePicker;