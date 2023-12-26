const Footer = () => {

    const currentYear = new Date().getFullYear();

    return(
        <div className="footer mt-auto">
            <div class="text-center p-4 bg-dark text-white">
                © {currentYear} All Rights Reserved <br />
                Powered by
                 <a class="text-reset fw-bold" href="https://lakinduw.me" style={{textDecoration: "none"}}> LWA Technologies</a>
            </div>
        </div>
    )
}

export default Footer;
