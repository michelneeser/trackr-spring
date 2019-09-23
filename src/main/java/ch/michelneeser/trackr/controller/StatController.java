package ch.michelneeser.trackr.controller;

import ch.michelneeser.trackr.model.Stat;
import ch.michelneeser.trackr.service.StatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/stats")
public class StatController {

    @Autowired
    private StatService statService;

    @GetMapping(value={"", "/"})
    public String getStat(Model model) {
        model.addAttribute("stat", statService.create());
        return "stat";
    }

    @GetMapping("/{token}")
    public String getStat(@PathVariable String token, Model model) {
        Stat stat = statService.get(token).orElse(statService.create());
        model.addAttribute("stat", stat);
        model.addAttribute("statValues", stat.getStatValues());
        return "stat";
    }

}