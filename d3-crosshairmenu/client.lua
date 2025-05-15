local showUI = false
local useCustomCrosshair = false
local crosshairImage = ""
local crosshairSize = 0.03

RegisterCommand('crosshair', function()
    showUI = not showUI
    SetNuiFocus(showUI, showUI)
    SendNUIMessage({ type = "toggleUI", status = showUI })
end)

RegisterNUICallback("closeUI", function(_, cb)
    showUI = false
    SetNuiFocus(false, false)
    SendNUIMessage({ type = "toggleUI", status = false })
    cb({})
end)

RegisterNUICallback("setCrosshair", function(data, cb)
    useCustomCrosshair = data.custom

    if data.custom then
        if data.image and data.size then
            crosshairImage = data.image
            crosshairSize = tonumber(data.size) or 0.03
        else
            useCustomCrosshair = false
            crosshairImage = ""
        end
    else
        crosshairImage = ""
        crosshairSize = 0.03
    end

    cb({})
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(100)

        SendNUIMessage({
            type = "updateCrosshair",
            show = useCustomCrosshair and crosshairImage ~= "",
            image = crosshairImage,
            size = crosshairSize,
        })
    end
end)
