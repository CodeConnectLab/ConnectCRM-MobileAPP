package com.calllog

import android.database.Cursor
import android.provider.CallLog
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class CallLogModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CallLogModule"
    }
    @ReactMethod
    fun getCallLogs(type: String, simSlot: String, limit: Int, promise: Promise) {
        val callLogsArray: WritableArray = Arguments.createArray()

        try {
            val selection = when (type.uppercase(Locale.getDefault())) {
                "INCOMING" -> "${CallLog.Calls.TYPE} = ${CallLog.Calls.INCOMING_TYPE}"
                "OUTGOING" -> "${CallLog.Calls.TYPE} = ${CallLog.Calls.OUTGOING_TYPE}"
                "MISSED" -> "${CallLog.Calls.TYPE} = ${CallLog.Calls.MISSED_TYPE}"
                "REJECTED" -> "${CallLog.Calls.TYPE} = ${CallLog.Calls.REJECTED_TYPE}"
                else -> null // For "ALL CALLS", no filter is applied
            }

//            val simSlotSelection = if (simSlot.isNotEmpty()) {
//                val simSlotValue = if (simSlot == "SIM 1") "2" else if (simSlot == "SIM 2") "1" else null
//                simSlotValue?.let { "subscription_id = '$it'" } // Adjust the mapping as needed
//            } else {
//                null
//            }
//
//            // Combine the filters if both are present
//            val finalSelection = when {
//                selection != null && simSlotSelection != null -> "$selection AND $simSlotSelection"
//                selection != null -> selection
//                simSlotSelection != null -> simSlotSelection
//                else -> null
//            }

            val cursor: Cursor? = reactApplicationContext.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                null,
                null,
                null,
                CallLog.Calls.DATE + " DESC"
            )

            cursor?.use {
                val simSlotIndex = it.getColumnIndex("subscription_id") // Check if the column exists
                val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()) // Define the desired date format (ISO 8601)
                val totalRecords = it.count // Total available records
                val actualLimit = if (limit > totalRecords) totalRecords else limit // Adjust limit based on available records

                var count = 0
                while (it.moveToNext() && count < actualLimit) {
                    val callLog = Arguments.createMap()
                    callLog.putString("name", it.getString(it.getColumnIndexOrThrow(CallLog.Calls.CACHED_NAME)))
                    callLog.putString("phoneNumber", it.getString(it.getColumnIndexOrThrow(CallLog.Calls.NUMBER)))

                    val callType = when (it.getInt(it.getColumnIndexOrThrow(CallLog.Calls.TYPE))) {
                        CallLog.Calls.INCOMING_TYPE -> "INCOMING"
                        CallLog.Calls.OUTGOING_TYPE -> "OUTGOING"
                        CallLog.Calls.MISSED_TYPE -> "MISSED"
                        CallLog.Calls.REJECTED_TYPE -> "REJECTED"
                        else -> "UNKNOWN"
                    }
                    callLog.putString("type", callType)

                    val dateMillis = it.getLong(it.getColumnIndexOrThrow(CallLog.Calls.DATE))
                    val formattedDate = dateFormat.format(Date(dateMillis))
                    callLog.putString("dateTime", formattedDate)
                    callLog.putString("timestamp", it.getString(it.getColumnIndexOrThrow(CallLog.Calls.DATE)))
                    callLog.putInt("duration", it.getInt(it.getColumnIndexOrThrow(CallLog.Calls.DURATION)))
                    val simType = if (simSlotIndex != -1) {
                        val simSlot = it.getString(simSlotIndex) // Get the subscription_id as a string
                        when (simSlot) {
                            "1" -> "SIM 2" // Adjust these mappings based on observed values in your logs
                            "2" -> "SIM 1"
                            else -> "Unknown SIM"
                        }
                    } else {
                        "Unknown SIM" // Default value if subscription_id column is not present
                    }
                    callLog.putString("simSlot", simType)

                    callLogsArray.pushMap(callLog)
                    count++
                }
            }

            promise.resolve(callLogsArray)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
